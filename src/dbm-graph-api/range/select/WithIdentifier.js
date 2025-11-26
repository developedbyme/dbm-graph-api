import Dbm from "dbm";

import SelectBaseObject from "./SelectBaseObject.js";

export default class WithIdentifier extends SelectBaseObject {
    _construct() {
        super._construct();
    }

    async select(aQuery, aData, aRequest) {
        aQuery.withIdentifier(aData["identifier"]);
    }

    async filter(aIds, aData, aRequest) {
        return aIds;
    }
}