import Dbm from "dbm";
import EncodeBaseObject from "./EncodeBaseObject.js";

export default class RepresentingPage extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.getInstance().repository.getItem("graphDatabase").controller.getObject(aId);

        let representingPage = await object.singleObjectRelationQuery("in:pageRepresentationFor:*");

        returnObject["representingPage"] = await aEncodingSession.encodeObjectOrNull(representingPage, "title");
        await aEncodingSession.encodeObjectOrNull(representingPage, "url");

        return returnObject;
    }
}