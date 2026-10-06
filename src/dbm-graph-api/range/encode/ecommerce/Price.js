import Dbm from "dbm";
import EncodeBaseObject from "../EncodeBaseObject.js";

export default class Price extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.node.getDatabase().getObject(aId);

        let fields = await object.getFields();
        returnObject["total"] = fields["total"] ? 1*fields["total"] : null;

        returnObject["offer"] = await aEncodingSession.encodeObjectOrNull(await object.singleObjectRelationQuery("in:for:priceOffer"), "title");

        return returnObject;
    }
}