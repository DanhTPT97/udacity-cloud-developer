// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'tcocr9lj72'
const region = 'us-east-1'
export const apiEndpoint = `https://${apiId}.execute-api.${region}.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-07p2gdalazukoacq.us.auth0.com',           // Auth0 domain
  clientId: 'K4JxxVrBzLaqEgsPPhzVB95ewADHmlGs',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
