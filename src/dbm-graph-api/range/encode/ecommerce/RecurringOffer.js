import Dbm from "dbm";
import EncodeBaseObject from "../EncodeBaseObject.js";

export default class RecurringOffer extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.node.getDatabase().getObject(aId);

        returnObject["price"] = await aEncodingSession.encodeObjectOrNull(await object.singleObjectRelationQuery("in:for:price"), "price");

        let fields = await object.getFields();
        returnObject["length"] = fields["length"] ? fields["length"] : null;

        return returnObject;
    }
}