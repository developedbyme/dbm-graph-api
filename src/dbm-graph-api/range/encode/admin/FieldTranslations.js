import Dbm from "dbm";
import EncodeBaseObject from "../EncodeBaseObject.js";

export default class Fields extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        await aEncodingSession.outputController.requireRole("admin");

        let object = Dbm.getInstance().repository.getItem("graphDatabase").controller.getObject(aId);

        let fields = await object.getAllFieldTranslations();
        returnObject["fields/translations"] = fields;

        return returnObject;
    }
}