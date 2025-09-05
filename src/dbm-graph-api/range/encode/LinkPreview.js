import Dbm from "dbm";
import EncodeBaseObject from "./EncodeBaseObject.js";

export default class LinkPreview extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.getInstance().repository.getItem("graphDatabase").controller.getObject(aId);

        let fields = await object.getFields();
        returnObject["title"] = fields["title"] !== undefined ? fields["title"] : null;
        returnObject["description"] = fields["description"] !== undefined ? fields["description"] : null;
        returnObject["linkText"] = fields["linkText"] !== undefined ? fields["linkText"] : null;

        await aEncodingSession.encodeObjectOrNull(object, "mainImage");

        {
            let relatedItem = await object.singleObjectRelationQuery("out:for:page");

            if(relatedItem) {
                returnObject["page"] = await aEncodingSession.encodeObjectOrNull(relatedItem, "url");
                await aEncodingSession.encodeObjectOrNull(relatedItem, "title");
                await aEncodingSession.encodeObjectOrNull(relatedItem, "mainImage");
                await aEncodingSession.encodeObjectOrNull(relatedItem, "publishDate");
            }
            else {
                returnObject["link"] = fields["link"] !== undefined ? fields["link"] : null;
            }
        }

        return returnObject;
    }
}