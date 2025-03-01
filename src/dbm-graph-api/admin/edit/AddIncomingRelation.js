import Dbm from "dbm";
import EditBaseObject from "./EditBaseObject.js";

export default class AddIncomigRelation extends EditBaseObject {
    _construct() {
        super._construct();
    }

    async performChange(aObject, aData, aRequest) {
        await aObject.addIncomingRelation(aData["value"], aData["type"]);
    }
}