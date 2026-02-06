import Dbm from "dbm";
import DbmGraphApi from "../../../index.js";

export default class ExternalCron extends DbmGraphApi.taskrunner.CronBaseObject {

    _construct() {
        super._construct();

        this.item.requireProperty("url", null);
        this.item.requireProperty("method", "GET");
        this.item.requireProperty("headers", {});
        this.item.requireProperty("body", null);
    }

    async runTask() {
        //console.log("ExternalCron::runTask");

        let requestData = {
            method: this.item.method,
            headers: this.item.headers
        };

        if(this.item.body) {
            requestData["body"] = this.item.body;
        }
        
        try {
            let startTime = performance.now();
            let response = await fetch(this.item.url, requestData);

            let responseText = await response.text();

            let endTime = performance.now();
        }
        catch(theError) {
            console.log(theError);
        }
    }
}