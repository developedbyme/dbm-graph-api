import Dbm from "dbm";
import EncodeBaseObject from "./EncodeBaseObject.js";

export default class HelpSection extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.getInstance().repository.getItem("graphDatabase").controller.getObject(aId);

        let fields = await object.getFields();
        returnObject["question"] = fields["question"] !== null ? fields["question"] : null;
        returnObject["title"] = fields["title"] !== null ? fields["title"] : null;
        returnObject["link"] = fields["link"] !== null ? fields["link"] : null;
        returnObject["content"] = fields["content"] !== null ? fields["content"] : null;
        returnObject["linkText"] = fields["linkText"] !== null ? fields["linkText"] : null;

        {
            let relatedItem = await object.singleObjectRelationQuery("out:for:page");

            returnObject["page"] = await aEncodingSession.encodeObjectOrNull(relatedItem, "url");
            await aEncodingSession.encodeObjectOrNull(relatedItem, "title");
        }

        return returnObject;
    }
}