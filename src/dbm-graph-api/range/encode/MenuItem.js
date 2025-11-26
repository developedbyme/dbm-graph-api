import Dbm from "dbm";
import EncodeBaseObject from "./EncodeBaseObject.js";

export default class MenuItem extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.getInstance().repository.getItem("graphDatabase").controller.getObject(aId);

        let fields = await object.getFields();
        returnObject["label"] = fields["label"] ? fields["label"] : null;
        returnObject["link"] = fields["link"] ? fields["link"] : null;

        return returnObject;
    }
}