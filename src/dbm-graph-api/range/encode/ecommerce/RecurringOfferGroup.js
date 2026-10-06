import Dbm from "dbm";
import EncodeBaseObject from "../EncodeBaseObject.js";

export default class RecurringOfferGroup extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.node.getDatabase().getObject(aId);

        {
            let relatedItems = await object.objectRelationQuery("in:in:recurringOffer");
            returnObject["offers"] = await aEncodingSession.encodeObjects(relatedItems, "recurringOffer");
        }

        let fields = await object.getFields();
        returnObject["order"] = fields["order"] ? fields["order"] : null;

        return returnObject;
    }
}