import Dbm from "dbm";

export default class ProcessActions extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    async performAction(aData, aEncodeSession) {
        let returnObject = {};

        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;

        let actionStatus = await database.getTypeObject("status/actionStatus", "readyToProcess");
        let actions = await actionStatus.objectRelationQuery("out:for:action");

        if(actions.length) {
            let action = actions[0];
            returnObject["processed"] = action.id;

            let processingActionStatus = await database.getTypeObject("status/actionStatus", "processing");
            await action.replaceIncomingRelation(processingActionStatus, "for", "status/actionStatus");

            let actionType = await (await action.singleObjectRelationQuery("in:for:type/actionType")).getIdentifier();
            console.log(actionType);
            
            let processActionItem = Dbm.getInstance().repository.getItemIfExists("graphApi/procesAction/" + actionType);

            if(processActionItem) {

                await processActionItem.controller.process(action);

                let doneActionStatus = await database.getTypeObject("status/actionStatus", "done");
                await action.replaceIncomingRelation(doneActionStatus, "for", "status/actionStatus");
            }
            else {
                let doneActionStatus = await database.getTypeObject("status/actionStatus", "noAction");
                await action.replaceIncomingRelation(doneActionStatus, "for", "status/actionStatus");
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