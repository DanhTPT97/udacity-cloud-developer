import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { ProductItem } from '../models/ProductItem'
import { UpdateProductRequest } from '../requests/UpdateProductRequest'
import { getPresignUrl } from './imageUpload'
import * as uuid from 'uuid'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('product-access-bus')

export class ProductAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly productsTable = process.env.PRODUCTS_TABLE,
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET) { }

    getProducts = async (userId: string): Promise<ProductItem[]> => {
        let products: ProductItem[]
        const result = await this.docClient.query({
            TableName: this.productsTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()
        products = result.Items as ProductItem[]
        logger.log('info', 'Retrieving products')
        return products
    }

    createProduct = async (product: ProductItem): Promise<ProductItem> => {
        await this.docClient.put({
            TableName: this.productsTable,
            Item: product
        }).promise()
        logger.log('info', `Product created: ${JSON.stringify(product)}`)
        return product
    }

    updateProduct = async (userId: string, productId: string, updateProduct: UpdateProductRequest): Promise<void> => {
        await this.docClient.update({
            TableName: this.productsTable,
            Key: {
                "userId": userId,
                "productId": productId
            },
            UpdateExpression: "set name=:name, description=:description, price=:price, quantity=:quantity, address=:address, workingStatus=:workingStatus",
            ExpressionAttributeValues: {
                ":name": updateProduct.name,
                ":description": updateProduct.description,
                ":price": updateProduct.price,
                ":quantity": updateProduct.quantity
            }
        }).promise()
        logger.log('info', `Product updated : ${JSON.stringify({ ...updateProduct, userId, productId })}`)
    }

    deleteProduct = async (userId: string, productId: string): Promise<void> => {
        await this.docClient.delete({
            TableName: this.productsTable,
            Key: {
                "userId": userId,
                "productId": productId
            }
        }).promise()
        logger.log('info', `Product deleted: ${productId}`)
    }

    getUploadURL = async (userId: string, productId: string): Promise<string> => {
        const imageId = uuid.v4()
        const presignedUrl = await getPresignUrl(imageId)
        this.docClient.update({
            TableName: this.productsTable,
            Key: {
                productId,
                userId
            },
            UpdateExpression: "set image = :image",
            ExpressionAttributeValues: {
                ":image": `https://${this.bucketName}.s3.amazonaws.com/${imageId}`,
            }
        }, (err, data) => {
            if (err) {
                logger.log('error', `Error: ${err.message}`)
                throw new Error(err.message)
            }
            logger.log('info', `Image uploaded: ${JSON.stringify(data)}`)
        })
        return presignedUrl
    }
}
