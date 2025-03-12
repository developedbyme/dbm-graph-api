import Dbm from "dbm";
import DbmGraphApi from "../../../index.js";

export default class InternalTaskRunner extends Dbm.core.BaseObject {

    _construct() {
        super._construct();

        this._isRunning = false;
        this._intervalId = -1;
        this._timeBetween = 5;

        this._runNextTaskBound = this._runNextTask.bind(this);
    }

    start() {
        if(!this._isRunning) {
            this._isRunning = true;
            this._runNextTask();
        }
    }

    startAtStartup() {
        console.log("startAtStartup");
        if(!this._isRunning) {
            this._isRunning = true;
            setTimeout(this._runNextTaskBound, this._timeBetween*1000);
        }
    }

    async _runNextTask() {
        console.log("_runNextTask");

        let runDirect = false;

        try {
            let encodeSession = new DbmGraphApi.range.EncodeSession();
            encodeSession.outputController = this;
    
            let dataFunctionItem = Dbm.getInstance().repository.getItemIfExists("graphApi/action/cron/processActions");
            let returnData = await dataFunctionItem.controller.performAction({}, encodeSession);
            
            console.log(returnData);

            if(returnData.remaining > 0) {
                runDirect = true
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