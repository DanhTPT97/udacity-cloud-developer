import { AttachmentUtils, getS3SignedUrl, attachmentBucket } from "../../src/helpers/attachmentUtils";
import * as AWS from 'aws-sdk';
import { DocumentClient as DocumentClient} from 'aws-sdk/clients/dynamodb'

const AWSXRay = require('aws-xray-sdk')

jest.mock('aws-sdk')
jest.spyOn(AWSXRay, 'captureAWS')

const XAWS = AWSXRay.captureAWS(AWS)

const docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE
const attachmentUtils = new AttachmentUtils(docClient, todosTable)

describe('Testing getS3SignedUrl', () => {
    test('Success getS3SignedUrl', async () => {
        const todoId = "todoId";
        const expectedSignedURL = "http://S3SignedUrl";
        (await attachmentBucket.getSignedUrl as jest.Mock).mockReturnValue(expectedSignedURL)

        const result = await getS3SignedUrl(todoId)
        expect(result).toEqual(expectedSignedURL)
    });
});

describe('Testing generateUploadURL', () => {
    test('Success generateUploadURL', async () => {
        const userId = "userId";
        const todoId = "todoId";
        const expectedSignedURL = "http://S3SignedUrl";
        (await attachmentBucket.getSignedUrl as jest.Mock).mockReturnValue(expectedSignedURL)

        const result = await attachmentUtils.generateUploadURL(userId, todoId)
        expect(result).toEqual(expectedSignedURL)
    });
});