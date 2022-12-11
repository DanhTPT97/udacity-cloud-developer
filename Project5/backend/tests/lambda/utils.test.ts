import { APIGatewayProxyEvent } from "aws-lambda";
import { parseUserId } from "../../src/auth/utils";
import { getUserId } from "../../src/lambda/utils";

jest.mock('../../src/auth/utils')

const mockEvent: APIGatewayProxyEvent = require("../../models/api-gateway-proxy-event-mock.json");

describe('Testing getUserId', () => {
    test('Success get UserId', async () => {
        //Mock expectedUserId return value
        const expectedUserId = "userId";
        (parseUserId as jest.Mock).mockReturnValue(expectedUserId);
        
        //Validate getUserId function response
        try {
            const result = getUserId(mockEvent)
            expect(result).toEqual(expectedUserId)
        } catch (exception) {
            expect(exception.message).toEqual('It should not reach here');
        }
    });
});