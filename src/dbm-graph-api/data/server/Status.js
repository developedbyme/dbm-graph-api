import Dbm from "dbm";

export default class Status extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    async getData(aData, aEncodeSession) {
        let returnObject = {};

        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;
        
        let connected = await database.testConnection();

        if(!connected) {
            throw("No database connection");
        }
        
        returnObject["databaseConnection"] = connected;

        return returnObject;
    }
}