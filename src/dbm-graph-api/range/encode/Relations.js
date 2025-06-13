import Dbm from "dbm";
import EncodeBaseObject from "./EncodeBaseObject.js";

export default class Relations extends EncodeBaseObject {
    _construct() {
        super._construct();
    }

    async getEncodedData(aId, aEncodingSession) {

        let returnObject = {};

        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;

        let object = database.getObject(aId);

        let relations = await database.getAllRelations(aId);

        returnObject["relations"] = relations;

        {
            let ids = Dbm.utils.ArrayFunctions.mapField(relations["in"], "id");
            await aEncodingSession.encodeObjects(database.getObjects(ids), "objectTypes");
        }
        {
            let ids = Dbm.utils.ArrayFunctions.mapField(relations["out"], "id");
            await aEncodingSession.encodeObjects(database.getObjects(ids), "objectTypes");
        }


        return returnObject;
    }
}