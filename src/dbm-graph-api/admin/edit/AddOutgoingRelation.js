import Dbm from "dbm";
import EditBaseObject from "./EditBaseObject.js";

export default class AddOutgoingRelation extends EditBaseObject {
    _construct() {
        super._construct();
    }

    performChange(aObject, aData, aRequest) {
        aObject.addOutgoingRelation(aData["value"], aData["type"]);
    }
}