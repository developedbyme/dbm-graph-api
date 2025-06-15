import Dbm from "dbm";
import EncodeBaseObject from "./EncodeBaseObject.js";

export default class MainImage extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.getInstance().repository.getItem("graphDatabase").controller.getObject(aId);

        let representingPage = await object.singleObjectRelationQuery("in:isMainImageFor:image");

        returnObject["image"] = await aEncodingSession.encodeObjectOrNull(representingPage, "image");

        return returnObject;
    }
}