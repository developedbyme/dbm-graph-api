import Dbm from "dbm";
import EncodeBaseObject from "./EncodeBaseObject.js";

export default class UrlRequest extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {
        console.log("UrlRequest::getEncodedData");

        let returnObject = {};

        let object = Dbm.getInstance().repository.getItem("graphDatabase").controller.getObject(aId);

        await aEncodingSession.encodeSingle(aId, "title");
        await aEncodingSession.encodeSingle(aId, "content");

        let fields = await object.getFields();
        returnObject["meta/description"] = fields["meta/description"] ? fields["meta/description"] : null;

        return returnObject;
    }
}