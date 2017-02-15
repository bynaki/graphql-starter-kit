/**
 * authorize middleware
 * 인증을 위해 jwt 토큰을 decoded하고 저장한다.
 */

import * as jwt from 'jsonwebtoken'
import {Request, Response, NextFunction} from 'express'
import promisify from 'fourdollar.promisify'
import {GraphqlErrorMessages} from '../utils'
import {
  IDecodedToken
} from '../interface'
import {
  registeredClaim
} from '../config'


export default async function authorize(
  req: Request, res: Response, next: NextFunction
) {
  // read the token from header of url
  const token = req.headers['x-access-token'] || req.query.token
  
  // token does not exist
  if(!token) {
    return next()
  }

  try {
    // create a promise that decodes the token
    const decoded: IDecodedToken = await promisify(jwt.verify)(
      token, req.app.get('jwt-secret'))
    if(decoded.iss !== registeredClaim.issuer 
      || decoded.sub !== registeredClaim.subject) {
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
    next(err)
  }
}