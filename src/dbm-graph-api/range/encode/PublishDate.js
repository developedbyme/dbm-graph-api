import Dbm from "dbm";
import EncodeBaseObject from "./EncodeBaseObject.js";

export default class PublishDate extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.getInstance().repository.getItem("graphDatabase").controller.getObject(aId);

        let fields = await object.getFields();

        returnObject["publishDate"] = fields["publishDate"] ? fields["publishDate"] : null;

        return returnObject;
    }
}