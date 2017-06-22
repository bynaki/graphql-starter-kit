/**
 * RootResolver
 * 인증이 필요 없는 resolver
 */

import {
  Request,
} from 'express'
import * as _ from 'lodash'
import {
  sign,
} from 'jsonwebtoken'
import p from 'fourdollar.promisify'
import {
  database,
  encrypt,
  ErrorWithStatusCode,
} from '../../utils'
import {
  User,
  Authorizer,
  AuthInput,
  UserInput,
} from '../../interface'
import cf from '../../config'


export default class RootResolver {
  constructor() {
  }

  echo({message}: {message: string}, req: Request): string {
    return `received ${message}`
  }

  async user(query: {id?: string, username?: string}): Promise<User> {
    const users = await this._findUsers(query)
    if(users.length != 0) {
      return users[0]
    } else {
      return null
    }
  }

  async users(): Promise<User[]> {
    return await this._findUsers({})
  }

  async myProfile(): Promise<Authorizer> {
    throw new ErrorWithStatusCode('must be authenticate!!', 401)
  }

  /**
   * Mutation
   */
  async createUser({input}: {input: UserInput}): Promise<User> {
    const knex = await database()
    if((await this._findUsers({username: input.username})).length != 0) {
      throw new Error('username exists')
    }
    const userInput = _.clone<UserInput>(input)
    userInput.password = encrypt(userInput.password)
    const ids: any[] = await knex('user').insert(userInput)
    return await this.user({id: ids[0]})
  }

  async createToken(
    {username, password, expiresIn}: 
    {username: string, password: string, expiresIn?: string}
    , req: Request): Promise<string> {
    const auth = await this._getAuthorizer(username)
    if(auth.password !== encrypt(password)) {
      throw new Error('authentication failed')
    }
    const jwt = _.cloneDeep(cf.jwt)
    if(expiresIn) {
      jwt.options.expiresIn = expiresIn
    }
    const token = await p(sign)({
        id: auth.id,
        username: auth.username,
        email: auth.email,
      },
      jwt.secret,
      jwt.options,
    )
    return token
  }

  /**
   * protected
   */
  protected async _findUsers(query?: any): Promise<User[]> {
    const knex = await database()
    const users: User[] = await knex('user')
      .select('id', 'username', 'email').where(query)
    return users
  }

  protected async _getAuthorizer(username: string): Promise<Authorizer> {
    const knex = await database()
    const rows: Authorizer[] = await knex('user')
      .select().where({username})
    if(rows.length !== 1) {
      throw new Error('must be 1')
    }
    return rows[0]
  }
}