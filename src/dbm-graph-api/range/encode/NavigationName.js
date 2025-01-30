import Dbm from "dbm";
import EncodeBaseObject from "./EncodeBaseObject.js";

export default class NavigationName extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.getInstance().repository.getItem("graphDatabase").controller.getObject(aId);

        let fields = await object.getFields();
        returnObject["navigationName"] = fields["navigationName"] ? fields["navigationName"] : null;

        return returnObject;
    }
}