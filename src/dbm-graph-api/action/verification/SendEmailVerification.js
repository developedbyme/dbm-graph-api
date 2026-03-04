import Dbm from "dbm";
import crypto from "crypto";

export default class SendEmailVerification extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this.item.requireProperty("dataSalt", "7m,/7!lH6U~2lL[Z0RMfE`y.KKa+twH}[A7*|6=f|mu?sB[efsGJD{i~GU$<m8Q|");
        this.item.requireProperty("codeSalt", "rUMP^jiM%llGT+EnV{@?l[CmPdv.Oq-Z>ZgX;DV85NAp o:B]QO`n]Kyl=vhE~hC");
    }

    _timestampToMysqlDate(aTime) {
        let date = new Date(aTime);

        return date.toISOString().split("T").join(" ").split(".")[0];
    }

    async performAction(aData, aEncodeSession) {
        let returnObject = {};

        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;

        let verification = await database.createObject("private", ["verification"]);
        verification.addObjectType("verification/email");
        
        let email = aData["email"];

        let hash = crypto.createHash('sha256');
        hash.update(email + verification.id + this.item.dataSalt);
        let hashedData = hash.digest('hex');
        await verification.updateField("data", hashedData);

        let now = (new Date()).valueOf();
        let expireTime = now + 15 * 60 * 1000;
        let unverifiedStatus = await database.getTypeObject("status/verifcationStatus", "unverified");
        await verification.incomingRelations.add(unverifiedStatus, "for", this._timestampToMysqlDate(now), this._timestampToMysqlDate(expireTime));

        let expiredStatus = await database.getTypeObject("status/verifcationStatus", "expired");
        await verification.incomingRelations.add(expiredStatus, "for", this._timestampToMysqlDate(expireTime));

        let code = crypto.randomInt(100000, 1000000);
        let codeHash = crypto.createHash('sha256');
        codeHash.update(code + "" + verification.id + this.item.codeSalt);
        let hashedCode = codeHash.digest('hex');
        await verification.updateField("code", hashedCode);

        let key = crypto.randomUUID();
        await verification.setIdentifier(key);
        
        returnObject["email"] = email;
        returnObject["key"] = key;

        let codeKeywords = {
            "code": code
        }

        let keywordReplace = new Dbm.utils.KeywordReplace();
        keywordReplace.addKeywordProvider("verification", codeKeywords);

        let language = aData["language"] ? aData["language"] : "en";
        let communication = await Dbm.node.communication.sendEmailTemplate("emailVerification", email, keywordReplace, language);
        await verification.incomingRelations.add(communication, "for");

        return returnObject;
    }
}