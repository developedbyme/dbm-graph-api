import Dbm from "dbm";

export default class EditBaseObject extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    async performChange(aObject, aData, aRequest) {
        //MENOTE: should be overridden
    }
}