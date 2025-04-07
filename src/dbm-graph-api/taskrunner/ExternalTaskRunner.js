import Dbm from "dbm";
import DbmGraphApi from "../../../index.js";

export default class ExternalTaskRunner extends Dbm.core.BaseObject {

    _construct() {
        super._construct();

        this._isRunning = false;
        this._intervalId = -1;
        this._timeBetween = 5;

        this.item.requireProperty("name", "Unnamed task");
        this.item.requireProperty("url", null);
        this.item.requireProperty("method", "GET");
        this.item.requireProperty("headers", {});
        this.item.requireProperty("body", null);
        this.item.requireProperty("continueCheck", "remaining");
        this.item.requireProperty("continueField", "data.remaining");

        this._runNextTaskBound = this._runNextTask.bind(this);
    }

    start() {
        if(!this._isRunning) {
            this._isRunning = true;
            this._runNextTask();
        }
    }

    async _runNextTask() {
        //console.log("_runNextTask");

        let runDirect = false;

        try {
            let requestData = {
                method: this.item.method,
                headers: this.item.headers
            };

            if(this.item.body) {
                requestData["body"] = this.item.body;
            }

            let response = await fetch(this.item.url, requestData);

            let data = await response.json();

            let continueData = Dbm.objectPath(data, this.item.continueField);
            console.log(this.item.name + " " + continueData);

            if(continueData > 0) {
                runDirect = true;
            }
        }
        catch(theError) {
            console.log(theError);
        }

        if(this._isRunning) {
            if(runDirect) {
                this._intervalId = setTimeout(this._runNextTaskBound, 1);
            }
            else {
                this._intervalId = setTimeout(this._runNextTaskBound, this._timeBetween*1000);
            }
        }
    }
}