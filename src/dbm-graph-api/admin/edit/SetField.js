import Dbm from "dbm";
import EditBaseObject from "./EditBaseObject.js";

export default class SetField extends EditBaseObject {
    _construct() {
        super._construct();
    }

    async performChange(aObject, aData, aRequest) {
        await aObject.updateField(aData["field"], aData["value"]);
    }
}