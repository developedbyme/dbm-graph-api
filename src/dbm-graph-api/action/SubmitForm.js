import Dbm from "dbm";

export default class SubmitForm extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    async performAction(aData, aEncodeSession) {
        let returnObject = {};

        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;

        let typeName = aData["type"];

        let formSubmission = await database.createObject("private", ["formSubmission"]);

        await formSubmission.updateField("data", aData["data"]);
        await formSubmission.updateField("submissionTime", (new Date()).toISOString());

        let form = await database.getIdentifiableObject("form", typeName);
        await formSubmission.addIncomingRelation(form, "for");

        let actionType = await database.getTypeObject("type/actionType", "handleFormSubmission");

        let actionStatus = await database.getTypeObject("status/actionStatus", "readyToProcess");
        let action = await database.createObject("private", ["action"]);

        await action.addOutgoingRelation(formSubmission, "from");
        await action.addIncomingRelation(actionType, "for");
        await action.addIncomingRelation(actionStatus, "for");

        returnObject["id"] = formSubmission.id;

        return returnObject;
    }
}