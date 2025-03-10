import Dbm from "dbm";

import SelectBaseObject from "./SelectBaseObject.js";

export default class IncludeDraft extends SelectBaseObject {
    _construct() {
        super._construct();
    }

    async select(aQuery, aData, aRequest) {
        await aRequest.connection.requireRole("admin");

        aQuery.includeDraft();
    }

    async filter(aIds, aData, aRequest) {
        return aIds;
    }
}