import Dbm from "dbm";
import EncodeBaseObject from "./EncodeBaseObject.js";

export default class Example extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        returnObject["example"] = "This is an example";

        return returnObject;
    }
}