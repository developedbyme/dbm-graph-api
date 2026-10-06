import Dbm from "dbm";
import EncodeBaseObject from "../EncodeBaseObject.js";

export default class RequiredProductsGroup extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.node.getDatabase().getObject(aId);

        //METODO: requirement settings

        {
            let relatedItems = await object.objectRelationQuery("in:in:product");
            returnObject["product"] = await aEncodingSession.encodeObjects(relatedItems, "product");
            await aEncodingSession.encodeObjects(relatedItems, "product_requiredProducts");
        }

        return returnObject;
    }
}