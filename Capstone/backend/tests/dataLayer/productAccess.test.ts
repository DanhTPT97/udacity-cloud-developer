import { ProductAccess } from "../../src/dataLayer/productAccess"
import { ProductItem } from "../../src/models/ProductItem"
import { DocumentClient } from "aws-sdk/clients/dynamodb"
import * as AWS from "aws-sdk"
import { Request, Service } from "aws-sdk"

const AWSXRay = require('aws-xray-sdk')

jest.spyOn(AWSXRay, 'captureAWS')
jest.mock('aws-sdk')
jest.mock('aws-sdk/clients/dynamodb')


const documentClient: DocumentClient = new DocumentClient()
const productAccess = new ProductAccess(documentClient, "Products")
const mockAwsRequest: AWS.Request<AWS.DynamoDB.DocumentClient.QueryOutput, AWS.AWSError> = new Request(new Service(), '');

const mockProduct: ProductItem = require("../../mocks/product-item-mock.json")

afterEach(() => {
    jest.clearAllMocks();
});

describe('Testing getProductsForUser', () => {

    test('Success get Products for user', async () => {
        const expectedProducts: ProductItem[] = [mockProduct];
        const expectedQueryOutput = {
            Items: expectedProducts
        };
        (documentClient.query as jest.Mock).mockReturnValue(mockAwsRequest);
        (AWS.Request.prototype.promise as jest.Mock).mockReturnValue(expectedQueryOutput);
        try {
            const result = await productAccess.getProducts(mockProduct.userId)
            expect(result.length).toEqual(expectedProducts.length)
            expect(result[0].name).toEqual(expectedProducts[0].name)
            expect(result[0].description).toEqual(expectedProducts[0].description)
            expect(result[0].price).toEqual(expectedProducts[0].price)
            expect(result[0].quantity).toEqual(expectedProducts[0].quantity)        
        } catch (exception) {
            expect(exception.message).toEqual('It should not reach here');
        }
    });

    test('Success get empty Products list for user', async () => {
        const expectedEmptyProducts: ProductItem[] = [];
        const expectedQueryOutput = {
            Items: expectedEmptyProducts
        };
        (documentClient.query as jest.Mock).mockReturnValue(mockAwsRequest);
        (AWS.Request.prototype.promise as jest.Mock).mockReturnValue(expectedQueryOutput);
        try {
            const result = await productAccess.getProducts(mockProduct.userId)
            expect(result.length).toEqual(0)
        } catch (exception) {
            expect(exception.message).toEqual('It should not reach here');
        }
    });
});

describe('Testing createProductsForUser', () => {

    test('Success create Products for user', async () => {
        const expectedProducts: ProductItem[] = [mockProduct];
        const expectedQueryOutput = {
            Items: expectedProducts
        };
        (documentClient.put as jest.Mock).mockReturnValue(mockAwsRequest);
        (AWS.Request.prototype.promise as jest.Mock).mockReturnValue(expectedQueryOutput);
        try {
            const result = await productAccess.getProducts(mockProduct.userId)
            expect(result.length).toEqual(expectedProducts.length)
            expect(result[0].name).toEqual(expectedProducts[0].name)
            expect(result[0].description).toEqual(expectedProducts[0].description)
            expect(result[0].price).toEqual(expectedProducts[0].price)
            expect(result[0].quantity).toEqual(expectedProducts[0].quantity)
        } catch (exception) {
            expect(exception.message).toEqual('It should not reach here');
        }
    });
});

describe('Testing updateProductsForUser', () => {

    test('Success update Products for user', async () => {
        const expectedProducts: ProductItem[] = [mockProduct];
        const expectedQueryOutput = {
            Items: expectedProducts
        };
        (documentClient.query as jest.Mock).mockReturnValue(mockAwsRequest);
        (documentClient.update as jest.Mock).mockReturnValue(mockAwsRequest);
        (AWS.Request.prototype.promise as jest.Mock).mockReturnValue(expectedQueryOutput);
        try {
            await productAccess.updateProduct(mockProduct.userId, mockProduct.productId, mockProduct)
            expect(documentClient.update).toBeCalled()
        } catch (exception) {
            expect(exception.message).toEqual('It should not reach here');
        }
    });

    test('Fail to update Products for user', async () => {
        const expectedProducts: ProductItem[] = [];
        const expectedQueryOutput = {
            Items: expectedProducts
        };
        (documentClient.query as jest.Mock).mockReturnValue(mockAwsRequest);
        (AWS.Request.prototype.promise as jest.Mock).mockReturnValue(expectedQueryOutput);
        try {
            await productAccess.updateProduct(mockProduct.userId, "anyProductId", mockProduct)
        } catch (exception) {
            expect(documentClient.update).not.toBeCalled()
            expect(exception.message).toEqual(`Not found product item id for user ${mockProduct.userId}`);
        }
    });
});

describe('Testing deleteProductsForUser', () => {

    test('Success delete Products for user', async () => {
        const expectedProducts: ProductItem[] = [mockProduct];
        const expectedQueryOutput = {
            Items: expectedProducts
        };
        (documentClient.delete as jest.Mock).mockReturnValue(mockAwsRequest);
        (AWS.Request.prototype.promise as jest.Mock).mockReturnValue(expectedQueryOutput);
        try {
            await productAccess.deleteProduct(mockProduct.userId, mockProduct.productId)
            expect(documentClient.delete).toBeCalled()
        } catch (exception) {
            expect(exception.message).toEqual('It should not reach here');
        }
    });
});