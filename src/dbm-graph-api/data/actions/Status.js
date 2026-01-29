import Dbm from "dbm";

export default class Status extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    async getData(aData, aEncodeSession) {
        let returnObject = {};

        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;
        
        let actionStatus = await database.getTypeObject("status/actionStatus", "readyToProcess");
        let actions = await actionStatus.objectRelationQuery("out:for:action");
        
        returnObject["queueLength"] = actions.length;

        return returnObject;
    }
}