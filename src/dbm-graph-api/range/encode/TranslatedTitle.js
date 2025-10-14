import Dbm from "dbm";
import EncodeBaseObject from "./EncodeBaseObject.js";

export default class TranslatedTitle extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.getInstance().repository.getItem("graphDatabase").controller.getObject(aId);

        await aEncodingSession.encodeSingle(aId, "title");

        let fieldTranslations = await object.getFieldTranslation("title");
        returnObject["title/translations"] = fieldTranslations;

        return returnObject;
    }
}