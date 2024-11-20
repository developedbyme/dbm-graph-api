import Dbm from "dbm";

export default class SelectBaseObject extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    async select(aQuery, aData, aRequest) {

    }

    async filter(aIds, aData, aRequest) {
        return aIds;
    }
}