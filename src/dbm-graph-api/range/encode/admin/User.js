import Dbm from "dbm";
import EncodeBaseObject from "../EncodeBaseObject.js";

export default class User extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        await aEncodingSession.outputController.requireRole("admin");

        let object = Dbm.getInstance().repository.getItem("graphDatabase").controller.getUser(aId);

        let fields = await object.getFields();
        returnObject["name"] = fields["name"];
        returnObject["username"] = await object.getUsername();

        let relatedItems = await object.objectRelationQuery("in:for:type/userRole");
        returnObject["roles"] = await aEncodingSession.encodeObjects(relatedItems, "type");

        return returnObject;
    }
}