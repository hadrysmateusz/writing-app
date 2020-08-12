/**
 * This type is handmade. It is incomplete and may become outdated over time
 */
export interface CurrentUser {
  username: string
  attributes: {
    email: string
    email_verified: boolean
    sub: string
  }
  authenticationFlowType: string
  preferredMFA: string
  signInUserSession: {
    accessToken: {
      jwtToken: string
      payload: {
        auth_time: string
        client_id: string
        event_id: string
        exp: string
        iat: string
        iss: string
        jti: string
        scope: string
        sub: string
        token_use: string
        username: string
      }
    }
  }
}
