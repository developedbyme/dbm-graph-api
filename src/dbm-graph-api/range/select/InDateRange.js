import Dbm from "dbm";

import SelectBaseObject from "./SelectBaseObject.js";

export default class InDateRange extends SelectBaseObject {
    _construct() {
        super._construct();
    }

    async select(aQuery, aData, aRequest) {
        aQuery.inDateRange(aData["startDate"], aData["endDate"]);
    }

    async filter(aIds, aData, aRequest) {
        return aIds;
    }
}