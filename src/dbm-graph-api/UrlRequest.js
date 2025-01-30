import Dbm from "dbm";
import DbmGraphApi from "../../index.js";

export default class UrlRequest extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
		
		this._logs = [];
		this._encodedObjects = [];
		this._responseData = null;
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
	
    outputEncodedData(aId, aData, aEncoding) {
        //console.log("UrlRequest::outputEncodedData");
		
		this._encodedObjects.push({"id": aId, "data": aData, "encoding": aEncoding});
		
    }
	
	getResponse() {
		return {"objects": this._encodedObjects, "data": this._responseData, "logs": this._logs};
	}
}