import Dbm from "dbm";

import SelectBaseObject from "./SelectBaseObject.js";

export default class GlobalObjectRelationQuery extends SelectBaseObject {
    _construct() {
        super._construct();
    }

    async select(aQuery, aData, aRequest) {
        //console.log("ObjectRelationQuery::select");

        if(!aData["path"]) {
            throw("Parameter path not set");
        }
        if(!aData["identifer"]) {
            throw("Parameter identifer not set");
        }

        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;

        let globalObject = await database.getGlobalObject(aData["identifer"]);

        let fromIds = globalObject ? [globalObject.id] : [];

        let ids;
        if(aData["path"] === "(root)") {
            ids = fromIds;
        }
        else {
            ids = await database.objectRelationQuery(fromIds, aData["path"]);
        }

        console.log(ids);
        await aQuery.includeOnly(ids);
    }

    async filter(aIds, aData, aRequest) {
        return aIds;
    }
}