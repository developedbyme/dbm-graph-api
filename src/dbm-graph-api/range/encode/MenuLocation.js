import Dbm from "dbm";
import EncodeBaseObject from "./EncodeBaseObject.js";

export default class MenuLocation extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.getInstance().repository.getItem("graphDatabase").controller.getObject(aId);

        await aEncodingSession.encodeSingle(aId, "identifier");

        let relatedItem = await object.singleObjectRelationQuery("in:at:menu");

        returnObject["menu"] = await aEncodingSession.encodeObjectOrNull(relatedItem, "menu");

        return returnObject;
    }
}