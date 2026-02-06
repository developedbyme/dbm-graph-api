import Dbm from "dbm";
import DbmGraphApi from "../../../index.js";

import cron from 'node-cron';

export default class CronBaseObject extends Dbm.core.BaseObject {

    _construct() {
        super._construct();

        this._cronTask = null;

        this._callback_runTaskBound = this._callback_runTask.bind(this);
    }

    start(aSchedule, aTimezone = null) {
        if(!this._cronTask) {
            let options = {};
            if(aTimezone) {
                options["timezone"] = aTimezone;
            }
            this._cronTask = cron.createTask(aSchedule, this._callback_runTaskBound, options);
            this._cronTask.start();
        }
    }

    stop() {
        if(this._cronTask) {
            this._cronTask.stop();
            this._cronTask.destroy();
            this._cronTask = null;
        }
    }

    async runTask() {
        console.warn("runTask should be overridden", this);
    }

    async _callback_runTask(aTaskContext) {
        return await this.runTask();
    }
}