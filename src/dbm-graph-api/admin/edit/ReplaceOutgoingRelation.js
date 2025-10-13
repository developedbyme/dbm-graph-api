import Dbm from "dbm";
import EditBaseObject from "./EditBaseObject.js";

export default class ReplaceOutgoingRelation extends EditBaseObject {
    _construct() {
        super._construct();
    }

    async performChange(aObject, aData, aRequest) {
        await aObject.replaceOutgoingRelation(aData["value"], aData["type"], aData["objectType"]);
    }
}