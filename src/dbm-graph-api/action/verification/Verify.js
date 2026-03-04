import Dbm from "dbm";
import crypto from "crypto";

export default class Verify extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this.item.requireProperty("codeSalt", "rUMP^jiM%llGT+EnV{@?l[CmPdv.Oq-Z>ZgX;DV85NAp o:B]QO`n]Kyl=vhE~hC");
    }

    _timestampToMysqlDate(aTime) {
        let date = new Date(aTime);

        return date.toISOString().split("T").join(" ").split(".")[0];
    }

    async performAction(aData, aEncodeSession) {
        let returnObject = {};

        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;

        let key = aData["key"];

        returnObject["result"] = "none";

        let verification = await database.getIdentifiableObjectIfExists("verification", key);
        if(verification) {

            let statusObject = await verification.singleObjectRelationQuery("in:for:status/verifcationStatus");
            let status = await statusObject.getIdentifier();

            if(status === "unverified" || status === "verified") {
                let code = aData["code"];

                let fields = await verification.getFields();

                let codeHash = crypto.createHash('sha256');
                codeHash.update(code + "" + verification.id + this.item.codeSalt);
                let hashedCode = codeHash.digest('hex');

                if(fields["code"] === hashedCode) {
                    if(status === "unverified") {
                        let now = (new Date()).valueOf();
                        let expireTime = now + 30 * 60 * 1000;
                        let verifiedStatus = await database.getTypeObject("status/verifcationStatus", "verified");
                        await verification.incomingRelations.replace(verifiedStatus, "for", "status/verifcationStatus", this._timestampToMysqlDate(expireTime));

                        let expiredStatus = await database.getTypeObject("status/verifcationStatus", "expired");
                        await verification.incomingRelations.add(expiredStatus, "for", this._timestampToMysqlDate(expireTime));
                    }

                    returnObject["result"] = "verified";
                }
                else {
                    returnObject["result"] = "incorrectCode";
                }
            }
            else {
                returnObject["result"] = "invalidStatus";
            }
            
        }
        
        return returnObject;
    }
}