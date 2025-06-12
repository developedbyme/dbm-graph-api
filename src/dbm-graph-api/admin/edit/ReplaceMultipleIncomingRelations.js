import Dbm from "dbm";
import EditBaseObject from "./EditBaseObject.js";

export default class ReplaceMultipleIncomingRelations extends EditBaseObject {
    _construct() {
        super._construct();
    }

    async performChange(aObject, aData, aRequest) {
        await aObject.replaceMultipleIncomingRelations(aData["value"], aData["type"], aData["objectType"]);
    }
}