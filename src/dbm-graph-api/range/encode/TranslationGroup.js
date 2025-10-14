import Dbm from "dbm";
import EncodeBaseObject from "./EncodeBaseObject.js";

export default class TranslationGroup extends EncodeBaseObject {

     static DEFAULT_ENCODING_NAME = "translationGroup";

    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {
        //console.log("TranslationGroup::getEncodedData");

        let returnObject = {};

        let object = Dbm.getInstance().repository.getItem("graphDatabase").controller.getObject(aId);


        {
            let relatedItems = await object.objectRelationQuery("in:in:page");
            returnObject["pages"] = await aEncodingSession.encodeObjects(relatedItems, "language");
            await aEncodingSession.encodeObjects(relatedItems, "url");
        }

        return returnObject;
    }
}