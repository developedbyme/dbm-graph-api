import Dbm from "dbm";
import EncodeBaseObject from "./EncodeBaseObject.js";

export default class Image extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.getInstance().repository.getItem("graphDatabase").controller.getObject(aId);

        let fields = await object.getFields();
        returnObject["originalFileName"] = fields["originalFileName"];
        returnObject["path"] = fields["path"];
        returnObject["url"] = fields["url"];
        returnObject["resizeUrl"] = fields["resizeUrl"];
        returnObject["altText"] = this._dataOrNull(fields["altText"]);

        await aEncodingSession.encodeSingle(aId, "identifier");
        await aEncodingSession.encodeSingle(aId, "name");

        return returnObject;
    }
}