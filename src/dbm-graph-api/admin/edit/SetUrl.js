import Dbm from "dbm";
import EditBaseObject from "./EditBaseObject.js";

export default class SetUrl extends EditBaseObject {
    _construct() {
        super._construct();
    }

    async performChange(aObject, aData, aRequest) {
        await aObject.setUrl(aData["value"]);
    }
}