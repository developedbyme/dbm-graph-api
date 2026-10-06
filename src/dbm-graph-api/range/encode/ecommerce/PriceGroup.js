import Dbm from "dbm";
import EncodeBaseObject from "../EncodeBaseObject.js";

export default class PriceGroup extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.node.getDatabase().getObject(aId);

        returnObject["regularPrice"] = await aEncodingSession.encodeObjectOrNull(await object.singleObjectRelationQuery("in:for/regularPrice:price"), "price");
        returnObject["offer"] = await aEncodingSession.encodeObjectOrNull(await object.singleObjectRelationQuery("in:for/offer:price"), "price");

        returnObject["tax"] = await aEncodingSession.encodeObjectOrNull(await object.singleObjectRelationQuery("out:in:group/tax"), "taxGroup");

        returnObject["interval"] = await aEncodingSession.encodeObjectOrNull(await object.singleObjectRelationQuery("in:for:interval"), "identifier");
        returnObject["recurringOffer"] = await aEncodingSession.encodeObjectOrNull(await object.singleObjectRelationQuery("in:for:group/recurringOffer"), "recurringOfferGroup");

        return returnObject;
    }
}