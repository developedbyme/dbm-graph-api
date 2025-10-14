import Dbm from "dbm";
import EditBaseObject from "./EditBaseObject.js";

export default class SetFieldTranslation extends EditBaseObject {
    _construct() {
        super._construct();
    }

    async performChange(aObject, aData, aRequest) {
        await aObject.updateFieldTranslation(aData["field"], aData["language"], aData["value"]);
    }
}