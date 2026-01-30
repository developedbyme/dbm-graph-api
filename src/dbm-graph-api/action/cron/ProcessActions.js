import Dbm from "dbm";

export default class ProcessActions extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    async performAction(aData, aEncodeSession) {
        let returnObject = {};

        let database = Dbm.getRepositoryItem("graphDatabase").controller;

        let actionStatus = await database.getTypeObject("status/actionStatus", "readyToProcess");
        let actions = await actionStatus.objectRelationQuery("out:for:action");

        if(actions.length) {
            let action = actions[0];
            returnObject["processed"] = action.id;

            await action.changeLinkedType("status/actionStatus", "processing");

            let actionType = await action.getSingleLinkedType("type/actionType");
            
            let processActionItem = Dbm.getInstance().repository.getItemIfExists("graphApi/processAction/" + actionType);
            
            if(processActionItem) {
                await processActionItem.controller.process(action);
                await action.changeLinkedType("status/actionStatus", "done");
            }
            else {
                console.warn("No action of type", actionType);
                await action.changeLinkedType("status/actionStatus", "noAction");
            }

            returnObject["remaining"] = actions.length-1;
        }
        else {
            returnObject["processed"] = 0;
            returnObject["remaining"] = 0;
        }

        return returnObject;
    }
}