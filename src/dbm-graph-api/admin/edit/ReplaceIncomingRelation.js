import Dbm from "dbm";
import EditBaseObject from "./EditBaseObject.js";

export default class ReplaceIncomigRelation extends EditBaseObject {
    _construct() {
        super._construct();
    }

    async performChange(aObject, aData, aRequest) {
        await aObject.replaceIncomingRelation(aData["value"], aData["type"], aData["objectType"]);
    }
}