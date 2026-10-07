import Dbm from "dbm";
import EncodeBaseObject from "../../EncodeBaseObject.js";

export default class LineItem extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.node.getDatabase().getObject(aId);

        await object.loadFields();

        returnObject["quantity"] = object.fields["quantity"];
        returnObject["unitPrice"] = object.fields["unitPrice"];

        let type = await object.singleObjectRelationQuery("in:for:type/lineItemType");

        returnObject["type"] = await aEncodingSession.encodeObjectOrNull(type, "type");

        if(type) {
            let typeIdentifier = await type.getIdentifier();
            await aEncodingSession.encodeSingle(aId, "lineItem_" + typeIdentifier);
        }

        return returnObject;
    }
}