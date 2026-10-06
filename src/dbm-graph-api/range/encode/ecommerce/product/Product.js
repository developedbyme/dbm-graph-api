import Dbm from "dbm";
import EncodeBaseObject from "../../EncodeBaseObject.js";

export default class Product extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.node.getDatabase().getObject(aId);

        await aEncodingSession.encodeSingle(aId, "title");
        await aEncodingSession.encodeSingle(aId, "product_priceGroup");

        return returnObject;
    }
}