import * as AWS from 'aws-sdk'

const bucketName = process.env.ATTACHMENT_S3_BUCKET
const URLExpiration = process.env.S3_URL_EXPIRATION

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

export const bucket = new XAWS.S3({
    signatureVersion: "v4",
})

export const getPresignUrl = async (imageId: string) => {
    const preSignedURL = await bucket.getSignedUrl("putObject", {
        Bucket: bucketName,
        Key: imageId,
        Expires: URLExpiration,
    });
    return preSignedURL;
}