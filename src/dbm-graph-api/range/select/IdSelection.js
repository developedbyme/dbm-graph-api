import Dbm from "dbm";

import SelectBaseObject from "./SelectBaseObject.js";

export default class IdSelection extends SelectBaseObject {
    _construct() {
        super._construct();
    }

    async select(aQuery, aData, aRequest) {
        aQuery.includeOnly(aData["ids"]);
    }

    async filter(aIds, aData, aRequest) {
        return aIds;
    }
}