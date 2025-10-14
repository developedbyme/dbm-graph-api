import Dbm from "dbm";
import EncodeBaseObject from "./EncodeBaseObject.js";

export default class Language extends EncodeBaseObject {
    _construct() {
        super._construct();

        this.outputFieldName = "language";
        this.relationPath = "in:for:language";
        this.encodeType = "type";
    }

    setup(aOutputFieldName, aRelationPath, aEncodeType) {

        this.outputFieldName = aOutputFieldName;
        this.relationPath = aRelationPath;
        this.encodeType = aEncodeType;

        return this;
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let object = Dbm.getRepositoryItem("graphDatabase").controller.getObject(aId);

        returnObject[this.outputFieldName] = await aEncodingSession.encodeObjectOrNull(await object.singleObjectRelationQuery(this.relationPath), this.encodeType);

        return returnObject;
    }

    static create(aOutputFieldName, aRelationPath, aEncodeType) {
        let newEncoder = new Language();
        newEncoder.setup(aOutputFieldName, aRelationPath, aEncodeType);

        return newEncoder;
    }
}