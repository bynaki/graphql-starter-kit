/**
 * app
 */

import * as express from 'express'
import * as bodyParser from 'body-parser'
import {GraphQLSchema} from 'graphql'
import {graphqlExpress, graphiqlExpress} from 'graphql-server-express'
import {makeExecutableSchema} from 'graphql-tools'
import schema from './schema'

export class Server {
  private app: express.Application

  constructor() {
    this.app = express()

    /**
     * GraphQL
     * http://dev.apollodata.com/tools/graphql-server/setup.html#graphqlExpress
     */
    this.app.use('/graphql', bodyParser.json(), graphqlExpress({
      schema,
    }))
    /**
     * GraphIQL
     * http://dev.apollodata.com/tools/graphql-server/graphiql.html#graphiqlExpress
     */
    this.app.use('/graphiql', graphiqlExpress({
      endpointURL: '/graphql',
    }))
  }

  get application(): express.Application {
    return this.app
  }
}
