import Dbm from "dbm";
import EditBaseObject from "./EditBaseObject.js";

export default class AddOutgoingRelation extends EditBaseObject {
    _construct() {
        super._construct();
    }

    async performChange(aObject, aData, aRequest) {
        await aObject.addOutgoingRelation(aData["value"], aData["type"]);
    }
}