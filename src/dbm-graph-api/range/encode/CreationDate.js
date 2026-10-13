import Dbm from "dbm";
import EncodeBaseObject from "./EncodeBaseObject.js";

export default class CreationDate extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.node.getDatabase().getObject(aId);

        returnObject["creationDate"] = await object.getCreationDate();

        return returnObject;
    }
}