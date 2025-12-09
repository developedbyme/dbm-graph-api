import Dbm from "dbm";
import EncodeBaseObject from "./EncodeBaseObject.js";

export default class Action extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.getRepositoryItem("graphDatabase").controller.getObject(aId);

        let fields = await object.getFields();
        returnObject["data"] = fields["data"] ? fields["data"] : null;

        {
            let relatedItems = await object.objectRelationQuery("out:from:*");
            returnObject["from"] = await aEncodingSession.encodeObjects(relatedItems, "id");
        }

        {
            let relatedObject = await object.singleObjectRelationQuery("in:for:type/actionType");
            returnObject["type"] = await aEncodingSession.encodeObjectOrNull(relatedObject, "type");
        }

        {
            let relatedObject = await object.singleObjectRelationQuery("in:for:status/actionStatus");
            returnObject["status"] = await aEncodingSession.encodeObjectOrNull(relatedObject, "type");
        }
        

        return returnObject;
    }
}