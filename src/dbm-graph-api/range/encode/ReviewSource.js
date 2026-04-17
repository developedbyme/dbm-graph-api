import Dbm from "dbm";
import EncodeBaseObject from "./EncodeBaseObject.js";

export default class ReviewSource extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.getInstance().repository.getItem("graphDatabase").controller.getObject(aId);

        let fields = await object.getFields();
        returnObject["imageUrl"] = fields["imageUrl"];
        returnObject["link"] = fields["link"];
        
        returnObject["type"] = await aEncodingSession.encodeObjectOrNull(await object.singleObjectRelationQuery("in:for:type/reviewSourceType"), "type");

        return returnObject;
    }
}