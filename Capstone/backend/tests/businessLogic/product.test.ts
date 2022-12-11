import { ProductAccess } from "../../src/dataLayer/productAccess"
import { ProductItem } from "../../src/models/ProductItem"
import { CreateProductRequest } from "../../src/requests/CreateProductRequest"
import { UpdateProductRequest } from "../../src/requests/UpdateProductRequest"
import { getProducts, createProduct, updateProduct, deleteProduct, generateImageURL } from "../../src/businessLogic/product"

const AWSXRay = require('aws-xray-sdk')

jest.spyOn(AWSXRay, 'captureAWS')
jest.mock('../../src/dataLayer/productAccess')

const mockProduct: ProductItem = require("../../mocks/product-item-mock.json")

describe('Testing get Products', () => {

    test('Success get Products', async () => {
        const expected: ProductItem[] = [mockProduct]
        ProductAccess.prototype.getProducts = jest.fn().mockReturnValue(expected)
        try {
            const result = await getProducts(mockProduct.userId)
            expect(result.length).toEqual(expected.length)
        } catch (exception) {
            expect(exception.message).toBe('It should not reach here')
        }
    })

    test('Success get empty Products array with new user', async () => {
        const emptyProducts: ProductItem[] = []
        ProductAccess.prototype.getProducts = jest.fn().mockReturnValue(emptyProducts)
        try {
            const result = await getProducts(mockProduct.userId)
            expect(result.length).toEqual(0)
        } catch (exception) {
            expect(exception.message).toBe('It should not reach here')
        }
    })
})

describe('Testing create Product', () => {

    test('Success create Product', async () => {
        const createRequest: CreateProductRequest = {
            name: mockProduct.name,
            description: mockProduct.description,
            price: mockProduct.price,
            quantity: mockProduct.quantity
        }
        ProductAccess.prototype.createProduct = jest.fn().mockReturnValue(mockProduct)
        try {
            const result = await createProduct(mockProduct.userId, createRequest)
            expect(result.name).toEqual(mockProduct.name)
            expect(result.description).toEqual(mockProduct.description)
            expect(result.price).toEqual(mockProduct.price)
            expect(result.quantity).toEqual(mockProduct.quantity)
        } catch (exception) {
            expect(exception.message).toBe('It should not reach here')
        }
    })

    test('Success create Product with empty parameter', async () => {
        const emptyCreateRequest: CreateProductRequest = {
            name: '',
            description: '',
            price: 0,
            quantity: 0
        }
        ProductAccess.prototype.createProduct = jest.fn().mockReturnValue(mockProduct)
        try {
            const result = await createProduct(mockProduct.userId, emptyCreateRequest)
            expect(result.name).toEqual('')
            expect(result.description).toEqual('')
            expect(result.price).toEqual(0)
            expect(result.quantity).toEqual(0)
        } catch (exception) {
            expect(exception.message).toBe('It should not reach here')
        }
    })
})

describe('Testing update Product', () => {

    test('Success update Product', async () => {
        const updateRequest: UpdateProductRequest = {
            name: mockProduct.name,
            description: mockProduct.description,
            price: mockProduct.price,
            quantity: mockProduct.quantity
        }
        ProductAccess.prototype.updateProduct = jest.fn().mockImplementationOnce(() => Promise.resolve())
        try {
            await updateProduct(mockProduct.userId, mockProduct.productId, updateRequest)
            expect(ProductAccess.prototype.updateProduct).toHaveBeenCalledTimes(1)
        } catch (exception) {
            expect(exception.message).toBe('It should not reach here')
        }
    })

    test('Fail to update Product', async () => {
        const updateRequest: UpdateProductRequest = {
            name: mockProduct.name,
            description: mockProduct.description,
            price: mockProduct.price,
            quantity: mockProduct.quantity
        }
        const error = new Error(`Not found ProductId item id for user ${mockProduct.userId}`)
        ProductAccess.prototype.updateProduct = jest.fn().mockRejectedValue(error)
        try {
            const result = await updateProduct(mockProduct.userId, "anyProductId", updateRequest)
            expect(result).toEqual('It should not reach here')
        } catch (exception) {
            expect(exception.message).toBe(error.message)
        }
    })
})

describe('Testing deleteProduct', () => {

    test('Success delete Product', async () => {
        ProductAccess.prototype.deleteProduct = jest.fn().mockImplementationOnce(() => Promise.resolve())
        try {
            await deleteProduct(mockProduct.userId, mockProduct.productId)
            expect(ProductAccess.prototype.deleteProduct).toHaveBeenCalledTimes(1)
        } catch (exception) {
            expect(exception.message).toBe('It should not reach here')
        }
    })
})

describe('Testing generateImageURL', () => {

    test('Success generateImageURL', async () => {
        ProductAccess.prototype.getUploadURL = jest.fn().mockReturnValue(mockProduct.image)
        try {
            const result = await generateImageURL(mockProduct.userId, mockProduct.productId)
            expect(result).toEqual(mockProduct.image)
        } catch (exception) {
            expect(exception.message).toBe('It should not reach here')
        }
    })

    test('Fail to generateImageURL', async () => {
        const error = new Error(`Not found Product id for user ${mockProduct.userId}`)
        ProductAccess.prototype.getUploadURL = jest.fn().mockRejectedValue(error)
        try {
            const result = await generateImageURL(mockProduct.userId, "anyProductId")
            expect(result).toEqual('It should not reach here')
        } catch (exception) {
            expect(exception.message).toBe(error.message)
        }
    })
})