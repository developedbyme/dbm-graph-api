import Dbm from "dbm";

export default class UpdateAttemptDetails extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    async performAction(aData, aEncodeSession) {
        let returnObject = {};

        let database = Dbm.node.getDatabase();

        let stripeSettings = Dbm.repository.getItem("stripe");

        let stripePaymentAttempt = database.getObject(1*aData["id"]);
        let storedKey = await stripePaymentAttempt.getIdentifier();

        if(storedKey !== aData["key"]) {
            //METODO: should this throw?
            return returnObject;
        }

        let currentStatus = await stripePaymentAttempt.getSingleLinkedType("type/paymentAttemptStatus");
        if(currentStatus !== "pending") {
            //METODO: should this throw?
            return returnObject;
        }
        
        let details = aData["details"];
        await stripePaymentAttempt.updateField("details", details);

        return returnObject;
    }
}