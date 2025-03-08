import Dbm from "dbm";
import crypto from "node:crypto";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default class UploadS3 extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this.item.requireProperty("client");
        this.item.requireProperty("bucketName");
        this.item.requireProperty("path", "content/{year}/{month}/{date}/{generatedId}/");
        this.item.requireProperty("publicPath", "");
        this.item.requireProperty("publicResizePath", "");
        this.item.requireProperty("acl", "public-read");
        this.item.requireProperty("additionalHeaders", {});
    }

    async getData(aData, aEncodeSession) {

        await aEncodeSession.outputController.requireRole("admin");

        let returnObject = {};

        let originalFileName = aData["fileName"];
        let fileName = originalFileName.toLowerCase();
        let mimeType = aData["mimeType"];

        fileName = fileName.replace(/[åäã]/gi, 'a');
        fileName = fileName.replace(/[ö]/gi, 'o');
        fileName = fileName.replace(/ /gi, '-');
        fileName = fileName.replace(/[\(\),\*']/gi, '');
        fileName = fileName.replace(/[^a-z0-9\-_\.]/gi, '-');
        fileName = fileName.replace(/\-+/gi, '-');

        let date = new Date();

        let month = (date.getMonth()+1);
        if(month < 10) month = "0" + month;

        let dateDay = (date.getDate());
        if(dateDay < 10) dateDay = "0" + dateDay;

        let generatedId = crypto.randomBytes(6).toString('base64url');

        let fullPath = this.item.path;
        fullPath = fullPath.split("{year}").join(date.getFullYear());
        fullPath = fullPath.split("{month}").join(month);
        fullPath = fullPath.split("{date}").join(dateDay);
        fullPath = fullPath.split("{generatedId}").join(generatedId);

        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;
        let item = await database.createObject("public", ["image"]);

        fileName = fullPath + fileName;
        let acl = this.item.acl;

        let command = new PutObjectCommand({
            Bucket: this.item.bucketName,
            Key: fileName,
            ContentType: mimeType,
            ACL: acl,
        });

        let presignedUrl = await getSignedUrl(this.item.client, command, { expiresIn: 360 });

        await item.setIdentifier(generatedId);
        await item.updateField("name", originalFileName);
        await item.updateField("path", fileName);
        await item.updateField("originalFileName", originalFileName);
        await item.updateField("url", this.item.publicPath + fileName);
        await item.updateField("resizeUrl", this.item.publicResizePath + fileName);

        returnObject["id"] = item.id;
        returnObject["identifier"] = generatedId;
        returnObject["url"] = presignedUrl;
        returnObject["name"] = fileName;
        returnObject["originalFileName"] = fileName;
        returnObject["publicUrl"] = this.item.publicPath + fileName;
        returnObject["publicResizeUrl"] = this.item.publicResizePath + fileName;
        returnObject["acl"] = acl;
        returnObject["additionalHeaders"] = this.item.additionalHeaders;

        return returnObject;
    }
}