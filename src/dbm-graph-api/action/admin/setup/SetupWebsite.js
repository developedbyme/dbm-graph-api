import Dbm from "dbm";

export default class SetupWebsite extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    async performAction(aData, aEncodeSession) {
        let returnObject = {};

        let user = await aEncodeSession.outputController.getUser();
        
        if(user) {
            let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;

            let globalObject = await database.getIdentifiableObject("globalObject", "website");

            let website = await globalObject.singleObjectRelationQuery("out:pointingTo:*");
            if(!website) {
                website = await database.createObject("private", ["website"]); 
                await globalObject.addOutgoingRelation(website, "pointingTo");
            }

            returnObject["id"] = website.id;
        }

        return returnObject;
    }
}