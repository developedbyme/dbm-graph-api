import Dbm from "dbm";

export default class RunFollowUpAction extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    async performAction(aData, aEncodeSession) {
        let returnObject = {};

        let database = Dbm.getRepositoryItem("graphDatabase").controller;

        let group = await database.getIdentifiableObjectIfExists("followUpAction", aData["id"]);
        if(group) {
            let action = await database.addActionToProcess("runFollowUpAction/" + aData["id"], group);
            returnObject["action"] = action.id;
        }
        else {
            returnObject["action"] = 0;
        }

        return returnObject;
    }
}