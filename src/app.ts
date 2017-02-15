/**
 * app
 */

import * as express from 'express'
import {Request, Response, NextFunction} from 'express'
import * as bodyParser from 'body-parser'
import {GraphQLError, GraphQLFormattedError} from 'graphql'
import * as graphqlHTTP from 'express-graphql'
import * as morgan from 'morgan'
import {secret} from './config'
import {schema, RootResolver, RootAuthResolver} from './schema'
import authorize from './middlewares/authorize'
import {GraphqlErrorMessages} from './utils'

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

    // this.app.use('/graphql', (req: Request, res: Response, next: NextFunction) => {
    //   graphqlHTTP((req: Request) => {
    //     const decodedToken = req['decoded']
    //     if(decodedToken) {
    //       return {
    //         schema,
    //         rootValue: new RootAuthResolver(decodedToken),
    //         graphiql: true,
    //         formatError: formatError(req, res, next),
    //       }
    //     } else {
    //       return {
    //         schema,
    //         rootValue: new RootResolver(),
    //         graphiql: true,
    //         formatError: formatError(req, res, next),
    //       }
    //     }
    //   })(req, res)
    // })

    // graphql middleware
    this.app.use('/graphql', graphqlHTTP((req: Request) => {
      const decodedToken = req['decoded']
      if(decodedToken) {
        return {
          schema,
          rootValue: new RootAuthResolver(decodedToken),
          graphiql: true,
        }
      } else {
        return {
          schema,
          rootValue: new RootResolver(),
          graphiql: true,
        }
      }
    }))

    // 내부 에러 처리
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      res.status(500).json({
        errors: new GraphqlErrorMessages((err as Error).message).errors
      })
    })
  }

  get application(): express.Application {
    return this.app
  }
}

// 디버깅에 활용하자
// function formatError(req: Request, res: Response, next: NextFunction) {
//   return (error: GraphQLError) => {
//     if(!error) {
//       throw new Error('Received null or undefined error.')
//     }
//     return {
//       message: error.message,
//       locations: error.locations,
//       path: error.path,
//     }
//   }
// }