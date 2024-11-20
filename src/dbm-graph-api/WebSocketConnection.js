import Dbm from "dbm";
import DbmGraphApi from "../../index.js";

export default class WebSocketConnection extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
        this._webSocket = null;

        this._callback_errorBound = this._callback_error.bind(this);
        this._callback_messageBound = this._callback_message.bind(this);
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
        console.log('received: %s', aDataString);
    
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
                        //METODO: log error
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
                
                this._webSocket.send(JSON.stringify({"type": "range/response", "ids": ids, "requestId": data["requestId"]}));
                break;
            case "data":
                {
                    let encodeSession = new DbmGraphApi.range.EncodeSession();
                    encodeSession.outputController = this;

                    let dataFunctionItem = Dbm.getInstance().repository.getItemIfExists("graphApi/data/" + data['functionName']);
                    
                    let returnData = null;
                    if(dataFunctionItem) {
                        returnData = await dataFunctionItem.controller.getData(data['data'], encodeSession);
                    }

                    this._webSocket.send(JSON.stringify({"type": "data/response", "data": returnData, "requestId": data["requestId"]}));
                }
                break;
            case "item":
                {
                    let id = data['id'];
                    //METODO: check visibility in database

                    let encodeSession = new DbmGraphApi.range.EncodeSession();
                    encodeSession.outputController = this;

                    await encodeSession.encodeSingleWithTypes(id, data.encode);

                    encodeSession.destroy();

                    this._webSocket.send(JSON.stringify({"type": "item/response", "id": id, "requestId": data["requestId"]}));
                }
                break;
            case "url":
                {
                    let url = data['url'];
                    if(url[url.length-1] !== "/") {
                        url += "/";
                    }
                    //METODO: check visibility in database

                    

                    let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;
                    let urlObject = await database.getObjectByUrl(url);

                    if(urlObject) {
                        let encodeSession = new DbmGraphApi.range.EncodeSession();
                        encodeSession.outputController = this;

                        await encodeSession.encodeSingleWithTypes(urlObject.id, ["urlRequest"]);
                        encodeSession.destroy();
                        this._webSocket.send(JSON.stringify({"type": "url/response", "id": urlObject.id, "requestId": data["requestId"]}));
                    }
                    else {
                        this._webSocket.send(JSON.stringify({"type": "url/response", "id": 0, "requestId": data["requestId"]}));
                    }
                }
                break;
            case "admin/createObject":
                {
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
                    
                    this._webSocket.send(JSON.stringify({"type": "item/response", "id": newObject.id, "requestId": data["requestId"]}));
                }
                break;
            case "admin/editObject":
                {
                    let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;

                    let theObject = database.getObject(data.id);

                    if(data.changes) {
                        await this._applyChanges(theObject, data.changes, request);
                    }
                    
                    if(data.encode) {

                        let encodeSession = new DbmGraphApi.range.EncodeSession();
                        encodeSession.outputController = this;

                        await encodeSession.encodeSingleWithTypes(theObject.id, data.encode);

                        encodeSession.destroy();
                    }
                    
                    this._webSocket.send(JSON.stringify({"type": "item/response", "id": theObject.id, "requestId": data["requestId"]}));
                }
                break;
            case "user/signInWithToken":
                {
                    let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;

                    let user = database.getUser(1*data.token.split(":")[1]);

                    let isVerified = await user.verifySignedSessionToken(data.token);

                    let userId = 0;
                    if(isVerified) {
                        //METODO: set user for connection
                        userId = user.id;
                    }

                    this._webSocket.send(JSON.stringify({"type": "currentUser/response", "id": userId, "requestId": data["requestId"]}));
                    
                }
                break;
        }	
    }

    _callback_error(aMessage) {
        console.error(aMessage);
    }

    addListeners() {

        this._webSocket.on('error', this._callback_error);
        this._webSocket.on('message', this._callback_messageBound);

        return this;
    }

    outputEncodedData(aId, aData, aEncoding) {
        console.log("WebSocketConnection::outputEncodedData");

        this._webSocket.send(JSON.stringify({"type": "updateEncodedObject", "id": aId, "data": aData, "encoding": aEncoding}));
        
    }

    setInitialUser(aId) {

        //METODO: set the user for connection

        this._webSocket.send(JSON.stringify({"type": "connectionReady", "user": aId}));
    }
}