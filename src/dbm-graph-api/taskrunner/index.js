import DbmGraphApi from "../../../index.js";

export {default as InternalTaskRunner} from "./InternalTaskRunner.js";
export {default as ExternalTaskRunner} from "./ExternalTaskRunner.js";
export {default as CronBaseObject} from "./CronBaseObject.js";
export {default as InternalCron} from "./InternalCron.js";
export {default as ExternalCron} from "./ExternalCron.js";

export const startInternalCron = function(aSchedule, aFunctionName) {
    let cronRunner = new DbmGraphApi.taskrunner.InternalCron();
    cronRunner.item.cronName = aFunctionName;
    cronRunner.start(aSchedule);
    return cronRunner;
}