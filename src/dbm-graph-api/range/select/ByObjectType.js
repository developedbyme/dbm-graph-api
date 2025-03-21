import Dbm from "dbm";

import SelectBaseObject from "./SelectBaseObject.js";

export default class ByObjectType extends SelectBaseObject {
    _construct() {
        super._construct();
    }

    async select(aQuery, aData, aRequest) {

        if(!aData["objectType"]) {
            throw("Parameter objectType not set");
        }

        await aQuery.setObjectType(aData["objectType"]);
    }

    async filter(aIds, aData, aRequest) {
        return aIds;
    }
}