export {default as SendEmail} from "./SendEmail.js";
import DbmGraphApi from "../../../../index.js";

export const setupEmail = function(aClient) {
    //console.log("setupEmail");

    let action = new DbmGraphApi.processAction.communication.SendEmail();
    action.item.setValue("client", aClient);

    DbmGraphApi.registerProcessActionFunction("sendEmail", action);

    return action;
}