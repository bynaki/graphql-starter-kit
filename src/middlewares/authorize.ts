/**
 * middleware auth.ts
 */

import * as jwt from 'jsonwebtoken'
import {Request, Response, NextFunction} from 'express'
import promisify from 'fourdollar.promisify'
import {GraphqlErrors} from '../utils'

export default async function authorize(
  req: Request, res: Response, next: NextFunction
) {
  // read the token from header of url
  const token = req.header['x-access-token'] || req.query.token

  // token does not exist
  if(!token) {
    return next()
  }

  try {
    // create a promise that decodes the token
    req['decoded'] = await promisify(jwt.verify)(
      token, req.app.get('jwt-secret'))
    next()
  } catch(err) {
    // if it has failed to verify, it will return an error message
    res.status(403).json({
      errors: new GraphqlErrors((err as Error).message).errors
    })
  }
}