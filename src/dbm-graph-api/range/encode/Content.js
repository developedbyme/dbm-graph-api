import Dbm from "dbm";
import EncodeBaseObject from "./EncodeBaseObject.js";

export default class Content extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.getInstance().repository.getItem("graphDatabase").controller.getObject(aId);

        let fields = await object.getFields();
        returnObject["content"] = fields["content"] ? fields["content"] : null;

        return returnObject;
    }
}