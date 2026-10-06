import Dbm from "dbm";
import EncodeBaseObject from "../../EncodeBaseObject.js";

export default class RequiredProducts extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.node.getDatabase().getObject(aId);
        
        {
            let relatedItems = await object.objectRelationQuery("out:requires:group/requiredProducts");
            returnObject["requiredProducts"] = await aEncodingSession.encodeObjects(relatedItems, "requiredProductsGroup");
        }

        return returnObject;
    }
}