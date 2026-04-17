import Dbm from "dbm";
import EncodeBaseObject from "./EncodeBaseObject.js";

export default class Review extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.getInstance().repository.getItem("graphDatabase").controller.getObject(aId);

        let fields = await object.getFields();
        returnObject["from"] = fields["from"];
        returnObject["date"] = fields["date"];
        returnObject["description"] = fields["description"];
        returnObject["rating"] = fields["rating"];
        
        returnObject["source"] = await aEncodingSession.encodeObjectOrNull(await object.singleObjectRelationQuery("out:from:reviewSource"), "reviewSource");

        return returnObject;
    }
}