import Dbm from "dbm";

import SelectBaseObject from "./SelectBaseObject.js";

export default class IncludeAnyStatus extends SelectBaseObject {
    _construct() {
        super._construct();
    }

    async select(aQuery, aData, aRequest) {
        await aRequest.connection.requireRole("admin");

        aQuery.includeAnyStatus();
    }

    async filter(aIds, aData, aRequest) {
        return aIds;
    }
}