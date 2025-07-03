import Dbm from "dbm";

export default class AddAndProcessAction extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    async performAction(aData, aEncodeSession) {
        let returnObject = {};

        await aEncodeSession.outputController.requireRole("admin");
        let user = await aEncodeSession.outputController.getUser();
        
        if(user) {
            let type = aData["type"];

            if(type) {
                let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;
                let action = await database.createObject("private", ["action"]);
                returnObject["id"] = action.id;

                let actionType = await database.getTypeObject("type/actionType", type);
                await action.addIncomingRelation(actionType, "for");
    
                if(aData["from"]) {
                    let fromItem = database.getItem(1*aData["from"]);
                    await action.addIncomingRelation(fromItem, "from");
                }
    
                let processingActionStatus = await database.getTypeObject("status/actionStatus", "processing");
                await action.replaceIncomingRelation(processingActionStatus, "for", "status/actionStatus");
    
                let processActionItem = Dbm.getInstance().repository.getItemIfExists("graphApi/processAction/" + type);
    
                if(processActionItem) {
    
                    await processActionItem.controller.process(action);
    
                    let doneActionStatus = await database.getTypeObject("status/actionStatus", "done");
                    await action.replaceIncomingRelation(doneActionStatus, "for", "status/actionStatus");
                }
                else {
                    let doneActionStatus = await database.getTypeObject("status/actionStatus", "noAction");
                    await action.replaceIncomingRelation(doneActionStatus, "for", "status/actionStatus");
                }
            }
            
            
        }

        return returnObject;
    }
}