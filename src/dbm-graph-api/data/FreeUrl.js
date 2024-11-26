import Dbm from "dbm";

export default class Example extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    async getData(aData, aEncodeSession) {
        let returnObject = {};

        let requestedUrl = aData["url"];
        let returnUrl = requestedUrl;

        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;

        let urlObject = await database.getObjectByUrl(requestedUrl + "/");

        if(urlObject) {
            let exisitingUrls = await database.getUrlsForNextId(requestedUrl);
            let idsToTry = exisitingUrls.length + 1;
            for(let i = 0; i < idsToTry; i++) {
                let currentId = i+2;
                let testUrl = requestedUrl + "-" + currentId;
                if(exisitingUrls.indexOf(testUrl + "/") === -1) {
                    returnUrl = testUrl;
                }
            }
        }

        returnObject["url"] = returnUrl;

        return returnObject;
    }
}