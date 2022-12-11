import { ProductAccess } from './productAccess'
import { ProductItem } from '../models/ProductItem'
import { CreateProductRequest } from '../requests/CreateProductRequest'
import { UpdateProductRequest } from '../requests/UpdateProductRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

const logger = createLogger('product-bus')
const productAccess = new ProductAccess()

export const getProducts = async (userId: string): Promise<ProductItem[]> => {
    return await productAccess.getProducts(userId);
}

export const createProduct = async (userId: string, product: CreateProductRequest): Promise<ProductItem> => {
    const productId = uuid.v4();
    const newProduct: ProductItem = {
        ...product,
        userId,
        productId,
        createdAt: new Date().toISOString()
    }
    logger.log('info', `Creating product: ${JSON.stringify(newProduct)}`)

    await productAccess.createProduct(newProduct);
    return newProduct;
}

export const updateProduct = async (userId: string, productId: string, updateProduct: UpdateProductRequest): Promise<void> => {
    logger.log('info', `Updating product ${productId}`)
    await productAccess.updateProduct(userId, productId, updateProduct)
}

export const deleteProduct = async (userId: string, productId: string): Promise<void> => {
    logger.log('info', `Deleting product ${productId}`)
    await productAccess.deleteProduct(userId, productId)
}

export const generateImageURL = async (userId: string, productId: string): Promise<string> => {
    logger.log('info', `Uploading image for product ${productId}`)
    const url = await productAccess.getUploadURL(userId, productId)
    return url 
}