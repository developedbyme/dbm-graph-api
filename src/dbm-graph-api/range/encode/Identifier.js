import Dbm from "dbm";
import EncodeBaseObject from "./EncodeBaseObject.js";

export default class Identifier extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.getInstance().repository.getItem("graphDatabase").controller.getObject(aId);

        returnObject["identifier"] = await object.getIdentifier();

        return returnObject;
    }
}