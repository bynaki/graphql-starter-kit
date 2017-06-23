/**
 * app
 */

import * as express from 'express'
import {
  Request,
  Response,
  NextFunction,
} from 'express'
import * as bodyParser from 'body-parser'
import {
  GraphQLError,
  GraphQLFormattedError
} from 'graphql'
import * as graphqlHTTP from 'express-graphql'
import * as cors from 'cors'
import * as morgan from 'morgan'
import cf from './config'
import {
  schema,
  RootResolver,
  RootAuthResolver,
} from './schema'
import {
  authentication,
} from './middlewares/authentication'
import {
  GraphqlErrorMessageList,
  ErrorWithStatusCode,
  MyErrorFormat,
} from './utils'


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

    // authentication middleware
    this.app.use(cors(), authentication(cf.jwt))

    // graphql middleware
    this.app.use('/graphql', cors(), (req: Request, res: Response, next: NextFunction) => {
      const decodedToken = req['decoded']
      graphqlHTTP({
        schema,
        rootValue: (decodedToken)? new RootAuthResolver(decodedToken) : new RootResolver(),
        graphiql: true,
        formatError: (error: GraphQLError): MyErrorFormat => {
          if(!error) {
            throw new Error('Received null or undefined error.')
          }
          let statusCode = 500
          if(error.originalError && (error.originalError as MyErrorFormat).statusCode) {
            statusCode = (error.originalError as MyErrorFormat).statusCode
          }
          res.statusCode = statusCode
          return {
            message: error.message,
            statusCode,
          }
        },
      })(req, res)
    })

    // 내부 에러 처리
    this.app.use((err: ErrorWithStatusCode, req: Request, res: Response, next: NextFunction) => {
      let statusCode = (err.statusCode)? err.statusCode : 500
      const error = new ErrorWithStatusCode(err.message, statusCode)
      res.status(statusCode).json({
        errors: new GraphqlErrorMessageList(error).errors
      })
    })
  }

  get application(): express.Application {
    return this.app
  }
}
