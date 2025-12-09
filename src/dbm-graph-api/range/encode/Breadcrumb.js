import Dbm from "dbm";
import EncodeBaseObject from "./EncodeBaseObject.js";

export default class Breadcrumb extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {
        //console.log("Breadcrumb::getEncodedData");

        let returnObject = {};

        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;
        let object = database.getObject(aId);

        let url = await object.getUrl();
        
        if(url) {
            let parts = url.split("/");
            parts.pop(); //MENOTE: remove trailing slash
            let ids = [];
    
            let currentArrayLength = parts.length;
            for(let i = 0; i < currentArrayLength; i++) {
                let currentUrl = parts.join("/") + "/";
    
                let currentObject = await database.getObjectByUrl(currentUrl);
                if(currentObject) {
                    await aEncodingSession.encodeSingle(currentObject.id, "title");
                    await aEncodingSession.encodeSingle(currentObject.id, "url");
                    await aEncodingSession.encodeSingle(currentObject.id, "navigationName");
                    ids.push(currentObject.id);
                }
    
                parts.pop();
            }
    
            ids.reverse();
    
            returnObject["breadcrumbs"] = ids;
        }
        else {
            returnObject["breadcrumbs"] = [];
        }
        

        return returnObject;
    }
}