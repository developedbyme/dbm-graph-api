import Dbm from "dbm";
import EditBaseObject from "./EditBaseObject.js";

export default class SetUrl extends EditBaseObject {
    _construct() {
        super._construct();
    }

    performChange(aObject, aData, aRequest) {
        aObject.setUrl(aData["value"]);
    }
}