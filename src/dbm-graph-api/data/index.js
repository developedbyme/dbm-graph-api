export {default as Example} from "./Example.js";
export {default as UploadS3} from "./UploadS3.js";
export {default as FreeUrl} from "./FreeUrl.js";
export {default as SeoSummary} from "./SeoSummary.js";

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
    newUploadS3.item.publicResizePath = aPublicPath;

    newUploadS3.item.additionalHeaders = {'x-amz-acl': 'public-read'};

    return newUploadS3;
}

export let createCloudflareR2Upload = function(aAccountId, aAccessKeyId, aSecretAccessKeyId, aBucketName, aPublicPath) {

    let client = new S3Client({
        endpoint: "https://" + aAccountId + ".r2.cloudflarestorage.com",
        forcePathStyle: false,
        region: "auto",
        credentials: {
            accessKeyId: aAccessKeyId,
            secretAccessKey: aSecretAccessKeyId
        }
    });

    let newUploadS3 = new UploadS3();
    newUploadS3.item.client = client;
    newUploadS3.item.bucketName = aBucketName;
    newUploadS3.item.publicPath = aPublicPath;
    newUploadS3.item.publicResizePath = aPublicPath + "cdn-cgi/image/{scale}/";

    return newUploadS3;
}