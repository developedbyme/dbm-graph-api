import Dbm from "dbm";
import DbmGraphApi from "../../../index.js";

export default class InternalCron extends DbmGraphApi.taskrunner.CronBaseObject {

    _construct() {
        super._construct();

        this.item.setValue("cronName", null);
    }

    async runTask() {
        console.log("InternalCron::runTask");
        let encodeSession = new DbmGraphApi.range.EncodeSession();
        encodeSession.outputController = this;
    
        let dataFunctionItem = Dbm.getRepositoryItemIfExists("graphApi/action/cron/" + this.item.cronName);

        if(dataFunctionItem) {
            try {
                await dataFunctionItem.controller.performAction({}, encodeSession);
            }
            catch(theError) {
                console.log(theError);
            }
        }
        else {
            console.warn("No cron function called " + this.item.cronName + ". Can't run internal cron.");
        }
        
    }
}