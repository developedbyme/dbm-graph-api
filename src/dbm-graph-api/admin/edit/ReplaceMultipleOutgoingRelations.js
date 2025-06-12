import Dbm from "dbm";
import EditBaseObject from "./EditBaseObject.js";

export default class ReplaceMultipleOutgoingRelations extends EditBaseObject {
    _construct() {
        super._construct();
    }

    async performChange(aObject, aData, aRequest) {
        await aObject.replaceMultipleOutgoingRelations(aData["value"], aData["type"]), aData["objectType"];
    }
}