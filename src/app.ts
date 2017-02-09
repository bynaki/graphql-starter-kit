/**
 * app
 */

import * as express from 'express'
import * as graphqlHTTP from 'express-graphql'
import schema from './schema/typedefs'
import rootValue from './schema/resolvers'

export class Server {
  private app: express.Application

  constructor() {
    this.app = express()

    this.app.use('/graphql', graphqlHTTP({
      schema,
      rootValue,
      graphiql: true,
    }))
  }

  get application(): express.Application {
    return this.app
  }
}
