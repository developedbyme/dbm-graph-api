import Dbm from "dbm";
import EncodeBaseObject from "../EncodeBaseObject.js";

export default class TaxGroup extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.node.getDatabase().getObject(aId);

        await aEncodingSession.encodeSingle(aId, "title");

        let fields = await object.getFields();
        returnObject["percentage"] = fields["percentage"] ? fields["percentage"] : null;

        return returnObject;
    }
}