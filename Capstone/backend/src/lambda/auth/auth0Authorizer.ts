import { APIGatewayTokenAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import { Auth0Key } from '../../auth/Auth0Key'
import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
const jwksUrl = 'https://dev-07p2gdalazukoacq.us.auth0.com/.well-known/jwks.json'

export const handler = async (event: APIGatewayTokenAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing for credential: '.concat(JSON.stringify(event.authorizationToken)))
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('Access granted: '.concat(JSON.stringify(jwtToken)))
    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (err) {
    logger.error('Access denied: '.concat(err.message))
    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

const certConvertToPEM = (certificate: string) => {
  return `-----BEGIN CERTIFICATE-----\n${certificate
    .match(/.{1,64}/g)
    .join('\n')}\n-----END CERTIFICATE-----\n`
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  try {
    const token = getToken(authHeader)
    const jwt: Jwt = decode(token, { complete: true }) as Jwt
    const jwtKid: string = jwt?.header?.kid as string
    const jwks = await Axios.get(jwksUrl, { headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' }})
    const jwksKeys: Array<Auth0Key> = jwks.data.keys
    const matchedKey = jwksKeys.filter((key) => key.kid === jwtKid)

    if (!matchedKey || !matchedKey.length)
      throw new Error('Provided keyId is invalid')

    const cert: string = certConvertToPEM(matchedKey[0].x5c[0])
    return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload;

  } catch (err) {
    logger.error('Authorizer failed with error: ', err)
  }
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')
  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')
  const split = authHeader.split(' ')
  const token = split[1]
  return token
}


