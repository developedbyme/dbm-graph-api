import Dbm from "dbm";
import EncodeBaseObject from "./EncodeBaseObject.js";

export default class Title extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.getInstance().repository.getItem("graphDatabase").controller.getObject(aId);

        let fields = await object.getFields();
        returnObject["title"] = fields["title"] ? fields["title"] : null;

        return returnObject;
    }
}