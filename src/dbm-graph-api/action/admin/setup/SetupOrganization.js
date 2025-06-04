import Dbm from "dbm";

export default class SetupOrganization extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    async performAction(aData, aEncodeSession) {
        let returnObject = {};

        let user = await aEncodeSession.outputController.getUser();
        
        if(user) {
            let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;


            let website = await database.getGlobalObject("website");
            
            if(website) {
                let organization = await website.singleObjectRelationQuery("out:by:organization");
                if(!organization) {
                    organization = await database.createObject("private", ["organization"]); 
                    await website.addOutgoingRelation(organization, "by");

                    let localBusiness = await database.createObject("private", ["localBusiness"]);
                    await organization.addIncomingRelation(localBusiness, "in");

                    let location = await database.createObject("private", ["location"]);
                    await location.updateField("name", "Local business location");
                    localBusiness.addOutgoingRelation(location, "at");

                    let schemaSubtype = "LocalBusiness";
                    if(aData["localBusinessType"]) {
                        schemaSubtype = aData["localBusinessType"]
                    }
                    let schemaType = await database.getTypeObject("schema/type", schemaSubtype);
                    localBusiness.addIncomingRelation(schemaType, "for");

                    returnObject["localBusinessId"] = localBusiness.id;
                }
            }

            returnObject["websiteId"] = website.id;
        }

        return returnObject;
    }
}