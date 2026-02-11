import Dbm from "dbm";
import DbmGraphApi from "../../index.js";

export default class WebSocketConnection extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
        this._webSocket = null;

        this.item.requireProperty("user", null);

        this._callback_errorBound = this._callback_error.bind(this);
        this._callback_messageBound = this._callback_message.bind(this);
		this._callback_closeBound = this._callback_close.bind(this);
    }

    setWebSocket(aWebSocket) {
        this._webSocket = aWebSocket;

        return this;
    }

    async _applyChanges(aObject, aChanges, aRequest) {
        let currentArray = aChanges;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentData = currentArray[i];
            let currentType = currentData["type"];
            let changeData = currentData["data"];

            let changeItem = Dbm.getInstance().repository.getItemIfExists("graphApi/admin/edit/" + currentType);
            if(changeItem) {
                await changeItem.controller.performChange(aObject, changeData, aRequest);
            }
        }
    }

    async _callback_message(aDataString) {
        //console.log('received: %s', aDataString);
    
        let data;

        try{
            data = JSON.parse(aDataString);
        }
        catch(theError) {
            return;
        }

        let request = {}; //METODO

        request.connection = this;

        let type = data["type"];
        switch(type) {
            case "range":
                let selectQuery = new DbmGraphApi.range.Query();
                
                let ids = [];
                let logs = [];

                try {
                    {
                        let hasSelection = false;
                        let currentArray = data.select;
                        let currentArrayLength = currentArray.length;
                        for(let i = 0; i < currentArrayLength; i++) {
                            let currentSelectData = currentArray[i];
                            let currentSelectType = currentSelectData["type"];
                            let selection = Dbm.getInstance().repository.getItemIfExists("graphApi/range/select/" + currentSelectType);
                            if(selection) {
                                hasSelection = true;
                                await selection.controller.select(selectQuery, currentSelectData, request);
                            }
                            else {
                                logs.push("No selection named " + currentSelectType);
                            }
                        }
    
                        if(hasSelection) {
                            ids = await selectQuery.getIds();
        
                            for(let i = 0; i < currentArrayLength; i++) {
                                let currentSelectData = currentArray[i];
                                let currentSelectType = currentSelectData["type"];
                                let selection = Dbm.getInstance().repository.getItemIfExists("graphApi/range/select/" + currentSelectType);
                                if(selection) {
                                    ids = await selection.controller.filter(ids, currentSelectData, request);
                                }
                            }
                        }
                        else {
                            logs.push("No valid selections");
                        }
                        
                    }
                    
                    {
                        let encodeSession = new DbmGraphApi.range.EncodeSession();
                        encodeSession.outputController = this;
    
                        let currentArray = data.encode;
                        let currentArrayLength = currentArray.length;
                        for(let i = 0; i < currentArrayLength; i++) {
                            let currentType = currentArray[i];
                            
                            await encodeSession.encode(ids, currentType);
                        }
    
                        encodeSession.destroy();
                    }
                }
                catch(theError) {
                    logs.push(theError.message);
                    console.error(theError);
                }

                this._sendData({"type": "range/response", "ids": ids, "requestId": data["requestId"], "logs": logs});
                break;
            case "data":
                {
                    let encodeSession = new DbmGraphApi.range.EncodeSession();
                    encodeSession.outputController = this;

                    let dataFunctionItem = Dbm.getInstance().repository.getItemIfExists("graphApi/data/" + data['functionName']);
                    
                    
                    let returnData = null;
                    let logs = [];

                    try {
                        if(dataFunctionItem) {
                            returnData = await dataFunctionItem.controller.getData(data['data'], encodeSession);
                        }
                    }
                    catch(theError) {
                        logs.push(theError.message);
                        console.error(theError);
                    }

                    this._sendData({"type": "data/response", "data": returnData, "requestId": data["requestId"], "logs": logs});
                }
                break;
            case "action":
                {
                    let encodeSession = new DbmGraphApi.range.EncodeSession();
                    encodeSession.outputController = this;

                    let dataFunctionItem = Dbm.getInstance().repository.getItemIfExists("graphApi/action/" + data['functionName']);
                    
                    let returnData = null;
                    let logs = [];

                    try {
                        if(dataFunctionItem) {
                            returnData = await dataFunctionItem.controller.performAction(data['data'], encodeSession);
                        }
                    }
                    catch(theError) {
                        logs.push(theError.message);
                        console.error(theError);
                    }

                    this._sendData({"type": "data/response", "data": returnData, "requestId": data["requestId"], "logs": logs});
                }
                break;
            case "item":
                {
                    let id = data['id'];
                    
                    let isOk = false;
                    let visibility = await Dbm.node.getDatabase().getObjectVisibility(id);
                    if(visibility === "public") {
                        isOk = true;
                    }
                    else {
                        let isAdmin = await this.hasRole("admin");
                        if(isAdmin) {
                            isOk = true;
                        }
                    }

                    let logs = [];

                    if(isOk) {
                        let encodeSession = new DbmGraphApi.range.EncodeSession();
                        encodeSession.outputController = this;

                        try {
                            await encodeSession.encodeSingleWithTypes(id, data.encode);
                        }
                        catch(theError) {
                            logs.push(theError.message);
                            console.error(theError);
                        }

                        encodeSession.destroy();
                    }
                    else {
                        logs.push("Not allowed to load item");
                    }

                    this._sendData({"type": "item/response", "id": id, "requestId": data["requestId"], "logs": logs});
                }
                break;
            case "url":
                {
                    let url = data['url'];
                    if(url[url.length-1] !== "/") {
                        url += "/";
                    }
                    
                    let database = Dbm.node.getDatabase();
                    let urlObject = await database.getObjectByUrl(url);

                    let logs = [];

                    let id = 0;
                    if(urlObject) {
                        id = urlObject.id;

                        let isOk = false;
                        let visibility = await urlObject.getVisibility();
                        if(visibility === "public") {
                            isOk = true;
                        }
                        else {
                            let isAdmin = await this.hasRole("admin");
                            if(isAdmin) {
                                isOk = true;
                            }
                        }

                        if(isOk) {
                            let encodeSession = new DbmGraphApi.range.EncodeSession();
                            encodeSession.outputController = this;

                            await encodeSession.encodeSingleWithTypes(urlObject.id, ["urlRequest"]);
                            encodeSession.destroy();
                        }
                        else {
                            logs.push("Not allowed to load item");
                        }
                    }
                    
                    this._sendData({"type": "url/response", "id": id, "requestId": data["requestId"], "logs": logs});
                }
                break;
            case "admin/createObject":
                {
                    let returnId = 0;
                    if(await this.hasRole("admin")) {
                        let types = data['types'];
                        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;
                        let visibility = data['visibility'] ? data['visibility'] : 'draft';
    
                        let draftVisibility = await database.getVisibilityType(visibility);
    
                        let newObject = await database.createObject(draftVisibility, types);
    
                        if(data.changes) {
                            await this._applyChanges(newObject, data.changes, request);
                        }
                        
                        if(data.encode) {
    
                            let encodeSession = new DbmGraphApi.range.EncodeSession();
                            encodeSession.outputController = this;
    
                            await encodeSession.encodeSingleWithTypes(newObject.id, data.encode);
    
                            encodeSession.destroy();
                        }

                        returnId = newObject.id;
                    }
                    else {
                        //METODO: add logs
                    }
                    
                    
                    this._sendData({"type": "item/response", "id": returnId, "requestId": data["requestId"]});
                }
                break;
            case "admin/editObject":
                {
                    let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;

                    let theObject = database.getObject(data.id);

                    if(await this.hasRole("admin")) {
                        if(data.changes) {
                            await this._applyChanges(theObject, data.changes, request);
                        }
                        
                        if(data.encode) {
    
                            let encodeSession = new DbmGraphApi.range.EncodeSession();
                            encodeSession.outputController = this;
    
                            await encodeSession.encodeSingleWithTypes(theObject.id, data.encode);
    
                            encodeSession.destroy();
                        }
                    }
                    else {
                        //METODO: add log
                    }
                    
                    
                    this._sendData({"type": "item/response", "id": theObject.id, "requestId": data["requestId"]});
                }
                break;
            case "user/signInWithToken":
                {
                    let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;

                    let user = database.getUser(1*data.token.split(":")[1]);

                    let isVerified = await user.verifySignedSessionToken(data.token);

                    let roleIds = [];
                    let userId = 0;
                    if(isVerified) {
                        userId = user.id;
                        this.item.setValue("user", user);

                        let roles = await user.getRoles();
            
                        let currentArray = roles;
                        let currentArrayLength = currentArray.length;
                        for(let i = 0; i < currentArrayLength; i++) {
                            roleIds.push(await currentArray[i].getIdentifier());
                        }
                    }

                    this._sendData({"type": "currentUser/response", "id": userId, "roles": roleIds, "requestId": data["requestId"]});
                }
                break;
            case "user/signOut":
                {
                    this.item.setValue("user", null);
                    this._sendData({"type": "currentUser/response", "id": 0, "roles": [], "requestId": data["requestId"]});
                }
                break;
            case "heartbeat":
                {
                    this._sendData({"type": "heartbeat/response"});
                }
                break;
        }	
    }

    _sendData(aData) {
        if(this._webSocket) {
            let encodedData = JSON.stringify(aData);
            try {
                this._webSocket.send(encodedData);
            }
            catch(theError) {
                console.error();
            }
        }
    }

    _callback_error(aMessage) {
		console.log("_callback_error");
        console.error(aMessage);
    }
	
    _callback_close() {
		//console.log("_callback_close");
		
		if(this._webSocket) {
			this._webSocket.off('error', this._callback_error);
			this._webSocket.off('message', this._callback_messageBound);
			this._webSocket.off('close', this._callback_closeBound);
			this._webSocket = null;
		}
		
		this._callback_errorBound = null;
		this._callback_messageBound = null;
		this._callback_closeBound = null;
		
		this.item.api.controller.connectionClosed(this);
		this.item.setValue("api", null);
		this.item.setValue("controller", null);

        this.item.setValue("user", null);
	}

    addListeners() {

        this._webSocket.on('error', this._callback_error);
        this._webSocket.on('message', this._callback_messageBound);
		this._webSocket.on('close', this._callback_closeBound);

        return this;
    }

    outputEncodedData(aId, aData, aEncoding) {
        //console.log("WebSocketConnection::outputEncodedData");

        this._sendData({"type": "updateEncodedObject", "id": aId, "data": aData, "encoding": aEncoding});
        
    }

    async setInitialUser(aId) {

        let roleIds = [];

        if(aId) {
            let user = Dbm.node.getDatabase().getUser(aId);
            this.item.setValue("user", user);

            let roles = await user.getRoles();
            
            let currentArray = roles;
            let currentArrayLength = currentArray.length;
            for(let i = 0; i < currentArrayLength; i++) {
                roleIds.push(await currentArray[i].getIdentifier());
            }
        }
        else {
            this.item.setValue("user", null);
        }

        this._sendData({"type": "connectionReady", "user": aId, "roles": roleIds});
    }

    async getUser() {
        return this.item.user;
    }

    async requireRole(aRole) {
		let user = await this.getUser();

		if(!user) {
			throw(new Error("Only signed in users can use this endpoint"));
		}

        let hasRole = await user.hasRole(aRole);
        if(!hasRole) {
            throw(new Error("User doesn't have privileges"));
        }

		return true;
	}

    async hasRole(aRole) {
        let user = await this.getUser();

		if(!user) {
			return false;
		}

        let hasRole = await user.hasRole(aRole);
        if(!hasRole) {
            return false;
        }

		return true;
    }
}