import Dbm from "dbm";
import DbmGraphApi from "../../index.js";

export default class UrlRequest extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
		
		this._logs = [];
		this._encodedObjects = [];
		this._responseData = null;

		this._request = null;
		this._reply = null;

		this.item.requireProperty("hasLoadedUser", false);
		this.item.requireProperty("user", null);
	}

	setup(aRequest, aReply) {
		this._request = aRequest;
		this._reply = aReply;

		return null;
	}
	
	async requestUrl(aUrl) {
		
		let url = aUrl;
		
        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;
        let urlObject = await database.getObjectByUrl(url);

        if(urlObject) {
            let encodeSession = new DbmGraphApi.range.EncodeSession();
            encodeSession.outputController = this;

            await encodeSession.encodeSingleWithTypes(urlObject.id, ["urlRequest"]);
            encodeSession.destroy();
            this._responseData = {"id": urlObject.id};
        }
        else {
            this._responseData = {"id": 0};
        }
	}
	
	async requestRange(aSelects, aEncodes, aData) {

		let request = {}; //METODO

        request.connection = this;

		let selectQuery = new DbmGraphApi.range.Query();
		
		let ids = [];
		let logs = [];

		{
			let hasSelection = false;
			let currentArray = aSelects;
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
					this._logs.push("No selection named " + currentSelectType);
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
				this._logs.push("No valid selections");
			}
			
		}
				
		{
			let encodeSession = new DbmGraphApi.range.EncodeSession();
			encodeSession.outputController = this;

			let currentArray = aEncodes;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentType = currentArray[i];
				
				await encodeSession.encode(ids, currentType);
			}

			encodeSession.destroy();
		}

		this._responseData = {"ids": ids};
	}
	
	async requestItem(aId, aEncodes) {
		let encodeSession = new DbmGraphApi.range.EncodeSession();
		encodeSession.outputController = this;

		//METODO: check visibility

		await encodeSession.encodeSingleWithTypes(aId, aEncodes);

		encodeSession.destroy();

		this._responseData = {"id": aId};
	}
	
	async requestData(aFunctionName, aData) {
		let encodeSession = new DbmGraphApi.range.EncodeSession();
		encodeSession.outputController = this;

		let dataFunctionItem = Dbm.getInstance().repository.getItemIfExists("graphApi/data/" + aFunctionName);
		
		let returnData = null;
		if(dataFunctionItem) {
			returnData = await dataFunctionItem.controller.getData(aData, encodeSession);
		}

		this._responseData = returnData;
	}

	async performAction(aFunctionName, aData) {
		let encodeSession = new DbmGraphApi.range.EncodeSession();
		encodeSession.outputController = this;

		let dataFunctionItem = Dbm.getInstance().repository.getItemIfExists("graphApi/action/" + aFunctionName);
		
		let returnData = null;
		if(dataFunctionItem) {
			returnData = await dataFunctionItem.controller.performAction(aData, encodeSession);
		}

		this._responseData = returnData;
	}

	async incomingWebhook(aWebhookType, aData) {
		let encodeSession = new DbmGraphApi.range.EncodeSession();
		encodeSession.outputController = this;

		let returnObject = {};

		let type = aWebhookType;
		let data = aData;

		let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;
				
		let webhookType = await database.getTypeObject("type/webhookType", type);

		let incomingWebhook = await database.createObject("private", ["incomingWebhook"]);
		await incomingWebhook.updateField("data", data);
		await incomingWebhook.addIncomingRelation(webhookType, "for");
		
		let actionType = await database.getTypeObject("type/actionType", "incomingWebhook/" + type);
		let actionStatus = await database.getTypeObject("status/actionStatus", "readyToProcess");
		
		let action = await database.createObject("private", ["action"]);
		await action.addIncomingRelation(actionType, "for");
		await action.addIncomingRelation(incomingWebhook, "from");
		await action.addIncomingRelation(actionStatus, "for");

		returnObject["id"] = incomingWebhook.id;
		returnObject["action"] = action.id;

		this._responseData = returnObject;
	}
	
    outputEncodedData(aId, aData, aEncoding) {
        //console.log("UrlRequest::outputEncodedData");
		
		this._encodedObjects.push({"id": aId, "data": aData, "encoding": aEncoding});
		
    }
	
	getResponse() {
		return {"objects": this._encodedObjects, "data": this._responseData, "logs": this._logs};
	}

	async _loadUser() {
		
		if(this._request.headers.cookie) {
			let cookies = this._request.headers.cookie.split(";");
			let currentArray = cookies;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let [key, value] = currentArray[i].split("=");
				if(key === "dbm_session" || key === " dbm_session") {
					let userId = 1*value.split(":")[1];
					let user = Dbm.getInstance().repository.getItem("graphDatabase").controller.getUser(userId);
	
					let isValidSession = await user.verifySession(value);

					if(isValidSession) {
						let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;
						
						let user = database.getUser(userId);
						this.item.setValue("user", user);
					}
					break;
				}
			}
		}

		this.item.setValue("hasLoadedUser", true);
	}

	async getUser() {
		if(!this.item.hasLoadedUser) {
			await this._loadUser();
		}

		return this.item.user;
	}

	async requireRole(aRole) {
		let user = await this.getUser();

		if(!user) {
			throw("Only signed in users can use this endpoint");
		}

		return true;
	}
}