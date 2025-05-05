import Dbm from "dbm";

import SelectBaseObject from "./SelectBaseObject.js";

export default class ObjectRelationQuery extends SelectBaseObject {
    _construct() {
        super._construct();
    }

    async select(aQuery, aData, aRequest) {
        //console.log("ObjectRelationQuery::select");

        if(!aData["path"]) {
            throw("Parameter path not set");
        }
        if(!aData["fromIds"]) {
            throw("Parameter fromIds not set");
        }

        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;

        let fromIds = Dbm.utils.ArrayFunctions.numericArrayOrSeparatedString(aData["fromIds"]);

        let ids = await database.objectRelationQuery(fromIds, aData["path"]);

        await aQuery.includeOnly(ids);
    }

    async filter(aIds, aData, aRequest) {
        return aIds;
    }
}