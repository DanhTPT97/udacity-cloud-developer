import * as AWS from 'aws-sdk'
import { DocumentClient as DocumentClient} from 'aws-sdk/clients/dynamodb'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic
export const attachmentBucket = new XAWS.S3({
    signatureVersion: "v4",
})

const bucketName = process.env.ATTACHMENT_S3_BUCKET
const URLExpiration = process.env.S3_URL_EXPIRATION

export class AttachmentUtils {

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE) { }

    generateUploadURL = async (userId: string, todoId: string): Promise<string> => {
        const url = await getS3SignedUrl(todoId)
        this.docClient.update({
            TableName: this.todosTable,
            Key: {
                todoId,
                userId
            },
            UpdateExpression: "set attachmentUrl = :attachmentUrl",
            ExpressionAttributeValues: {
                ":attachmentUrl": `https://${process.env.ATTACHMENT_S3_BUCKET}.s3.amazonaws.com/${todoId}`,
            }
        }, (err) => {
            if (err) {
                throw new Error(err.message)
            }
        })
        return url
    }
}


export const getS3SignedUrl = async (todoId: string) => {
    const signedURL = await attachmentBucket.getSignedUrl("putObject", {
        Bucket: bucketName,
        Key: todoId,
        Expires: URLExpiration,
    });
    return signedURL;
}