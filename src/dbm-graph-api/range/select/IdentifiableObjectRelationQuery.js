import Dbm from "dbm";

import SelectBaseObject from "./SelectBaseObject.js";

export default class IdentifiableObjectRelationQuery extends SelectBaseObject {
    _construct() {
        super._construct();
    }

    async select(aQuery, aData, aRequest) {
        //console.log("IdentifiableObjectRelationQuery::select");

        this.requireParameters(aData, "path", "fromType", "fromIdentifier");

        let globalObject = await Dbm.node.getDatabase().getIdentifiableObjectIfExists(aData["fromType"], aData["fromIdentifier"]);

        if(!globalObject) {
            console.log("No identifiable object", aData["fromType"], aData["fromIdentifier"]);
            //METODO: send back in logs as sensitive
        }

        let ids = globalObject ? [globalObject.id] : [];
        if(aData["path"] !== "(root)") {
            ids = await Dbm.node.getDatabase().objectRelationQuery(ids, aData["path"]);
        }

        aQuery.includeOnly(ids);
    }
}