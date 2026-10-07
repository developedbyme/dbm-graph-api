import Dbm from "dbm";
import EncodeBaseObject from "../../EncodeBaseObject.js";

export default class Order extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.node.getDatabase().getObject(aId);

        await aEncodingSession.encodeSingle(aId, "order_contactDetails");
        await aEncodingSession.encodeSingle(aId, "order_lineItems");

        return returnObject;
    }
}