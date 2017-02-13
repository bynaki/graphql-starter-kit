/**
 * app
 */

import * as express from 'express'
import {Request, Response, NextFunction} from 'express'
import * as bodyParser from 'body-parser'
import * as graphqlHTTP from 'express-graphql'
import * as morgan from 'morgan'
import {secret} from './config'
import {schema, RootResolver} from './schema'
import authorize from './middlewares/authorize'

export class Server {
  private app: express.Application

  /**
   * express configuration
   */
  constructor() {
    this.app = express()

    // parse JSON and url-encoded query
    this.app.use(bodyParser.urlencoded({extended: false}))
    this.app.use(bodyParser.json())

    // print the request log on console
    this.app.use(morgan('dev'))

    // set the secret key variable for jwt
    this.app.set('jwt-secret', secret)

    // authentication middleware
    this.app.use(authorize)

    // this.app.use('/graphql', graphqlHTTP({
    //   schema,
    //   rootValue,
    //   graphiql: true,
    // }))

    this.app.use('/graphql', graphqlHTTP((req: Request) => {
      return {
        schema,
        rootValue: new RootResolver(),
        graphiql: true,
      }
    }))
  }

  get application(): express.Application {
    return this.app
  }
}