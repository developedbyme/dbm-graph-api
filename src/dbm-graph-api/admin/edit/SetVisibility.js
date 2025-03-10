import Dbm from "dbm";
import EditBaseObject from "./EditBaseObject.js";

export default class SetVisibility extends EditBaseObject {
    _construct() {
        super._construct();
    }

    async performChange(aObject, aData, aRequest) {
        await aObject.setVisibility(aData["value"]);
    }
}