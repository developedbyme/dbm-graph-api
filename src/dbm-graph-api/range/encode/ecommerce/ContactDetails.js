import Dbm from "dbm";
import EncodeBaseObject from "../EncodeBaseObject.js";

export default class ContactDetails extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.node.getDatabase().getObject(aId);

        let fields = await object.getFields();
        returnObject["name"] = fields["name"] ? fields["name"] : null;
        returnObject["email"] = fields["email"] ? fields["email"] : null;
        returnObject["phoneNumber"] = fields["phoneNumber"] ? fields["phoneNumber"] : null;
        returnObject["address"] = fields["address"] ? fields["address"] : null;

        return returnObject;
    }
}