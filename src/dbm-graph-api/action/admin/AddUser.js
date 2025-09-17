import Dbm from "dbm";

export default class AddUser extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    async performAction(aData, aEncodeSession) {
        //console.log("AddUser");
        let returnObject = {};

        await aEncodeSession.outputController.requireRole("admin");

        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;
        
        let username = aData["username"];

        if(username) {
            let user = await database.getUserByUsername(username);

            if(!user) {
                user = await database.createUser();
                returnObject["created"] = true;

                await user.setUsername(username);
                if(aData["password"]) {
                    await user.setPassword(aData["password"]);
                }

                if(aData["role"]) {
                    let role = await database.getIdentifiableObject("type/userRole", aData["role"]);
                    await user.addIncomingRelation(role, "for");
                }
            }
            else {
                returnObject["created"] = false;
            }

            returnObject["id"] = user.id;
        }
        else {
            throw("No username");
        }

        return returnObject;
    }
}