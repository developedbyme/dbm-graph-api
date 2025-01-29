import Dbm from "dbm";

import SelectBaseObject from "./SelectBaseObject.js";

export default class ByObjectType extends SelectBaseObject {
    _construct() {
        super._construct();
    }

    async select(aQuery, aData, aRequest) {
        await aQuery.setObjectType(aData["objectType"]);
    }

    async filter(aIds, aData, aRequest) {
        return aIds;
    }
}