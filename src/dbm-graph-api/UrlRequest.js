import Dbm from "dbm";
import DbmGraphApi from "../../index.js";

export default class UrlRequest extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
		
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
		//METODO
	}
	
	async requestItem(aId, aEncodes) {
		//METODO
	}
	
	async requestData(aFunctionName, aData) {
		//METODO
	}
	
    outputEncodedData(aId, aData, aEncoding) {
        //console.log("UrlRequest::outputEncodedData");
		
		this._encodedObjects.push({"id": aId, "data": aData, "encoding": aEncoding});
		
    }
	
	getResponse() {
		return {"objects": this._encodedObjects, "data": this._responseData};
	}
}