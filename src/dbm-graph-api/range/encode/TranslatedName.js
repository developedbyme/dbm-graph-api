import Dbm from "dbm";
import EncodeBaseObject from "./EncodeBaseObject.js";

export default class TranslatedName extends EncodeBaseObject {

    static DEFAULT_ENCODING_NAME = "name_translations";

    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.getInstance().repository.getItem("graphDatabase").controller.getObject(aId);

        await aEncodingSession.encodeSingle(aId, "name");

        let fieldTranslations = await object.getFieldTranslation("name");
        returnObject["name/translations"] = fieldTranslations;

        return returnObject;
    }
}