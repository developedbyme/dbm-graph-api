import Dbm from "dbm";

export default class SetPassword extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    async performAction(aData, aEncodeSession) {
        //console.log("SetPassword");
        let returnObject = {};

        await aEncodeSession.outputController.requireRole("admin");

        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;
        
        let id = aData["id"];

        if(id) {
            let user = await database.getUser(id);

            if(user) {
                await user.setPassword(aData["password"]);
                returnObject["updated"] = true;
            }
            else {
                throw("No user");
            }
        }
        else {
            throw("No id");
        }

        return returnObject;
    }
}