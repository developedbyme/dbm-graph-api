import Dbm from "dbm";

export default class HandleFormSubmission extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    async process(aAction) {
        console.log("HandleFormSubmission:process");
        console.log(aAction);

        let formSubmission = await aAction.singleObjectRelationQuery("out:from:formSubmission");
        let form = await formSubmission.singleObjectRelationQuery("in:for:form");
        let formName = await form.getIdentifier();
        console.log(formSubmission);

        let formHandler = Dbm.getInstance().repository.getItem("formHandlers/" + formName);
        console.log(formHandler);

        if(formHandler.handle) {
            formHandler.handle(formSubmission);
        }
        else {
            //METODO: add logs
        }
    }
}