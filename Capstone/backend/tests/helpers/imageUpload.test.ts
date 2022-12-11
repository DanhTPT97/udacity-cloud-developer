import { getPresignUrl, bucket } from "../../src/helpers/imageUpload";
const AWSXRay = require('aws-xray-sdk')

jest.mock('aws-sdk')
jest.spyOn(AWSXRay, 'captureAWS')

describe('Testing getPresignUrl', () => {
    test('Success getPresignUrl', async () => {
        const todoId = "todoId";
        const expectedPresignedURL = "http://getPresignUrl";
        bucket.getSignedUrl = jest.fn().mockReturnValue(expectedPresignedURL)

        const result = await getPresignUrl(todoId)
        expect(result).toEqual(expectedPresignedURL)
    });
});