import Dbm from "dbm";
import EncodeBaseObject from "./EncodeBaseObject.js";

export default class MainImage extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.getInstance().repository.getItem("graphDatabase").controller.getObject(aId);

        {
            let relatedItem = await object.singleObjectRelationQuery("out:at:location");
            returnObject["location"] = await aEncodingSession.encodeObjectOrNull(relatedItem, "location");
        }
        

        return returnObject;
    }
}