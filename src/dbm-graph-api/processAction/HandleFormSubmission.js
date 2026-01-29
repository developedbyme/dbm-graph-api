import Dbm from "dbm";

export default class HandleFormSubmission extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    async process(aAction) {
        //console.log("HandleFormSubmission:process");

        let formSubmission = await aAction.singleObjectRelationQuery("out:from:formSubmission");
        let form = await formSubmission.singleObjectRelationQuery("in:for:form");
        let formName = await form.getIdentifier();

        let formHandler = Dbm.getRepositoryItem("formHandlers/" + formName);

        if(formHandler.handle) {
            formHandler.handle(formSubmission);
        }
        else {
            //METODO: add logs
        }
    }
}