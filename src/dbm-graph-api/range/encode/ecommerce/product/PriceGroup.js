import Dbm from "dbm";
import EncodeBaseObject from "../../EncodeBaseObject.js";

export default class PriceGroup extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.node.getDatabase().getObject(aId);

        returnObject["priceGroup"] = await aEncodingSession.encodeObjectOrNull(await object.singleObjectRelationQuery("out:in:priceGroup"), "priceGroup");

        return returnObject;
    }
}