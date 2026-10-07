import Dbm from "dbm";
import EncodeBaseObject from "../../EncodeBaseObject.js";

export default class LineItems extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.node.getDatabase().getObject(aId);

        {
            let relatedItems = await object.objectRelationQuery("in:in:lineItem");
            console.log(aId, relatedItems);
            returnObject["lineItems"] = await aEncodingSession.encodeObjects(relatedItems, "lineItem");
        }

        return returnObject;
    }
}