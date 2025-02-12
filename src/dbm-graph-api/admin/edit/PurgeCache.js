import Dbm from "dbm";
import EditBaseObject from "./EditBaseObject.js";

export default class PurgeCache extends EditBaseObject {
    _construct() {
        super._construct();
    }

    async performChange(aObject, aData, aRequest) {
        let url = await aObject.getUrl();
        console.log(url);
    }
}