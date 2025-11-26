import Dbm from "dbm";
import EncodeBaseObject from "./EncodeBaseObject.js";

export default class Menu extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.getInstance().repository.getItem("graphDatabase").controller.getObject(aId);

        await aEncodingSession.encodeSingle(aId, "language");

        {
            let relatedItems = await object.objectRelationQuery("in:in:menuItem");
            returnObject["menuItems"] = await aEncodingSession.encodeObjects(relatedItems, "menuItem");
        }

        let fields = await object.getFields();
        returnObject["order"] = fields["order"] ? fields["order"] : null;

        return returnObject;
    }
}