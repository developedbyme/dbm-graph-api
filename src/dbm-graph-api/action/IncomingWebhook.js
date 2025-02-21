import Dbm from "dbm";

export default class IncomingWebhook extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    async performAction(aData, aEncodeSession) {
        let returnObject = {};

        let type = aData['type'];
        let data = aData;

        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;
                
        let webhookType = await database.getTypeObject("type/webhookType", type);

        let incomingWebhook = await database.createObject("private", ["incomingWebhook"]);
        await incomingWebhook.updateField("data", data);
        await incomingWebhook.addIncomingRelation(webhookType, "for");
        
        let actionType = await database.getTypeObject("type/actionType", "incomingWebhook/" + type);
        let actionStatus = await database.getTypeObject("status/actionStatus", "readyToProcess");
        
        let action = await database.createObject("private", ["action"]);
        await action.addIncomingRelation(actionType, "for");
        await action.addIncomingRelation(incomingWebhook, "from");
        await action.addIncomingRelation(actionStatus, "for");

        returnObject["id"] = incomingWebhook.id;
        returnObject["action"] = action.id;

        return returnObject;
    }
}