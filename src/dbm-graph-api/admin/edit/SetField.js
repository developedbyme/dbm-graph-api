import Dbm from "dbm";
import EditBaseObject from "./EditBaseObject.js";

export default class SetField extends EditBaseObject {
    _construct() {
        super._construct();
    }

    performChange(aObject, aData, aRequest) {
        aObject.updateField(aData["field"], aData["value"]);
    }
}