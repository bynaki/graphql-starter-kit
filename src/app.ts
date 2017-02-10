/**
 * app
 */

import * as express from 'express'
import * as graphqlHTTP from 'express-graphql'
import {schema, RootResolver} from './schema'
import {Request, Response, NextFunction} from 'express'

export class Server {
  private app: express.Application

  constructor() {
    this.app = express()

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