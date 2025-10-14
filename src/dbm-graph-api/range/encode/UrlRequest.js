import Dbm from "dbm";
import EncodeBaseObject from "./EncodeBaseObject.js";

export default class UrlRequest extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {
        //console.log("UrlRequest::getEncodedData");

        let returnObject = {};

        let object = Dbm.getInstance().repository.getItem("graphDatabase").controller.getObject(aId);

        await aEncodingSession.encodeSingle(aId, "title");
        await aEncodingSession.encodeSingle(aId, "content");
        await aEncodingSession.encodeSingle(aId, "url");
        await aEncodingSession.encodeSingle(aId, "navigationName");
        await aEncodingSession.encodeSingle(aId, "pageRepresentation");
        await aEncodingSession.encodeSingle(aId, "language");

        let fields = await object.getFields();

        returnObject["publishDate"] = fields["publishDate"] ? fields["publishDate"] : null;

        returnObject["meta/description"] = fields["meta/description"] ? fields["meta/description"] : null;
        returnObject["seo/noIndex"] = fields["seo/noIndex"] ? fields["seo/noIndex"] : false;
        returnObject["seo/noFollow"] = fields["seo/noFollow"] ? fields["seo/noFollow"] : false;

        {
            let relatedItems = await object.objectRelationQuery("out:in:group/pageCategory");
            returnObject["categories"] = await aEncodingSession.encodeObjects(relatedItems, "type");
        }

        {
            let relatedItem = await object.singleObjectRelationQuery("out:in:group/pageCategory");

            returnObject["category"] = await aEncodingSession.encodeObjectOrNull(relatedItem, "type");
        }

        return returnObject;
    }
}