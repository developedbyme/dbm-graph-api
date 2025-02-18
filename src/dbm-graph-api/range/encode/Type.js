import Dbm from "dbm";
import EncodeBaseObject from "./EncodeBaseObject.js";

export default class Type extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.getInstance().repository.getItem("graphDatabase").controller.getObject(aId);

        await aEncodingSession.encodeSingle(aId, "identifier");
        await aEncodingSession.encodeSingle(aId, "name");

        return returnObject;
    }
}