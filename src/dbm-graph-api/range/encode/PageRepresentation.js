import Dbm from "dbm";
import EncodeBaseObject from "./EncodeBaseObject.js";

export default class PageRepresentation extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.getInstance().repository.getItem("graphDatabase").controller.getObject(aId);

        returnObject["representing"] = await aEncodingSession.encodeObjectOrNull(await object.singleObjectRelationQuery("out:pageRepresentationFor:*"), "objectTypes");

        return returnObject;
    }
}