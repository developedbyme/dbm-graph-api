import Dbm from "dbm";

export default class Breadcrumb extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    async getData(aData, aEncodeSession) {
        let returnObject = {};

        let url = aData["path"];
        if(url[url.length-1] !== "/") {
            url += "/";
        }

        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;
        let urlObject = await database.getObjectByUrl(url);

        if(urlObject) {

            await aEncodeSession.encodeSingleWithTypes(urlObject.id, ["breadcrumb"]);
            returnObject["id"] = urlObject.id;
        }

        return returnObject;
    }
}