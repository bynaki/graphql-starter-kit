/**
 * authenticaion middleware
 * 인증을 위해 jwt 토큰을 decoded하고 저장한다.
 */

import * as jwt from 'jsonwebtoken'
import {
  Request,
  Response,
  NextFunction,
} from 'express'
import p from 'fourdollar.promisify'
import {
  JwtConfig,
  DecodedToken,
} from '../interface'
import {
  ErrorWithStatusCode,
} from '../utils'


export function authentication(config: JwtConfig) {
  return async function(req: Request, res: Response, next: NextFunction) {
    // read the token from header of url
    const token = req.headers['x-access-token'] || req.query.token
    
    // token does not exist
    if(!token) {
      return next()
    }

    try {
      // create a promise that decodes the token
      const decoded: DecodedToken = await p(jwt.verify)(
        token, config.secret)
      if(decoded.iss !== config.options.issuer 
        || decoded.sub !== config.options.subject) {
          throw new Error('The wrong token.')
      }
      let now = Date.now()
      now = (now - now % 1000) / 1000
      if (!(now >= decoded.iat && now <= decoded.exp)) {
        throw new Error('The authentication has expired.')
      }
      req['decoded'] = decoded
      next()
    } catch(err) {
      // if it has failed to verify, it will return an error message
      next(new ErrorWithStatusCode((err as Error).message, 401))
    }
  }
}
