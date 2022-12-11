import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { generateImageURL } from '../../bus/product'
import { getUserId } from '../utils'

const logger = createLogger('generateUploadedImageURL')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const productId = event.pathParameters.productId
    const userId = getUserId(event)
    try {
      const imageURL = await generateImageURL(userId, productId)
      return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ uploadUrl: imageURL })
      }
    } catch (err) {
      logger.log('info', 'Error on Uploading Image URL...')
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify(err)
      }
    }

    
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
