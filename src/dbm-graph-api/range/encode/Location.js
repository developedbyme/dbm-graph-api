import Dbm from "dbm";
import EncodeBaseObject from "./EncodeBaseObject.js";

export default class Location extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.getInstance().repository.getItem("graphDatabase").controller.getObject(aId);

        let fields = await object.getFields();
        returnObject["street"] = fields["street"] ? fields["street"] : null;
        returnObject["postCode"] = fields["postCode"] ? fields["postCode"] : null;
        returnObject["city"] = fields["city"] ? fields["city"] : null;
        returnObject["country"] = fields["country"] ? fields["country"] : null;

        if(fields["latitude"]) {
            returnObject["coordinates"] = {latitude: fields["latitude"], longitude: fields["longitude"]};
        }
        else {
            returnObject["coordinates"] = null;
        }

        return returnObject;
    }
}