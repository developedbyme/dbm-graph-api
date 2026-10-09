import Dbm from "dbm";

import SelectBaseObject from "../SelectBaseObject.js";

export default class OrderByKey extends SelectBaseObject {
    _construct() {
        super._construct();
    }

    async select(aQuery, aData, aRequest) {

        if(!aData["order"]) {
            throw("Parameter order not set");
        }
        if(!aData["key"]) {
            throw("Parameter key not set");
        }

        await aQuery.setObjectType("order");
        aQuery.includeOnly([1*aData["order"]]);
        aQuery.includePrivate();
    }

    async filter(aIds, aData, aRequest) {
        return aIds;
    }
}