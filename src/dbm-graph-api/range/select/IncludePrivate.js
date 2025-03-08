import Dbm from "dbm";

import SelectBaseObject from "./SelectBaseObject.js";

export default class IncludePrivate extends SelectBaseObject {
    _construct() {
        super._construct();
    }

    async select(aQuery, aData, aRequest) {
        //METODO: check that we are allowed

        await aRequest.connection.requireRole("admin");

        aQuery.includePrivate();
    }

    async filter(aIds, aData, aRequest) {
        return aIds;
    }
}