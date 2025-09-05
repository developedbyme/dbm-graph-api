import Dbm from "dbm";
import EditBaseObject from "./EditBaseObject.js";

export default class AddAction extends EditBaseObject {
    _construct() {
        super._construct();
    }

    async performChange(aObject, aData, aRequest) {
        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;

        console.log(aData["type"], aObject);
        await database.addActionToProcess(aData["type"], [aObject]);
    }
}