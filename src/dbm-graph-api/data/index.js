export {default as Example} from "./Example.js";
export {default as UploadS3} from "./UploadS3.js";
export {default as FreeUrl} from "./FreeUrl.js";

import UploadS3 from "./UploadS3.js";

import { S3Client } from "@aws-sdk/client-s3";

export let createDigitalOceanSpacesUpload = function(aKeyId, aSecret, aRegion, aBucketName, aPublicPath = null) {

    if(aPublicPath === null) {
        aPublicPath = "https://" + aBucketName + "." + aRegion + ".cdn.digitaloceanspaces.com/";
    }

    let client = new S3Client({
        endpoint: "https://" + aRegion + ".digitaloceanspaces.com",
        forcePathStyle: false,
        region: aRegion,
        credentials: {
            accessKeyId: aKeyId,
            secretAccessKey: aSecret
        }
    });

    let newUploadS3 = new UploadS3();
    newUploadS3.item.client = client;
    newUploadS3.item.bucketName = aBucketName;
    newUploadS3.item.publicPath = aPublicPath;

    return newUploadS3;
}