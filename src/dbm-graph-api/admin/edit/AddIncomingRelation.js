import Dbm from "dbm";
import EditBaseObject from "./EditBaseObject.js";

export default class AddIncomigRelation extends EditBaseObject {
    _construct() {
        super._construct();
    }

    performChange(aObject, aData, aRequest) {
        aObject.addIncomingRelation(aData["value"], aData["type"]);
    }
}