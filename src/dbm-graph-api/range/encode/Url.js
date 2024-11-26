import Dbm from "dbm";
import EncodeBaseObject from "./EncodeBaseObject.js";

export default class Url extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.getInstance().repository.getItem("graphDatabase").controller.getObject(aId);

        let url = await object.getUrl();
        returnObject["url"] = url;

        return returnObject;
    }
}