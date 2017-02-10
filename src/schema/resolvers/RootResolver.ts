import {database} from './utils'
import {Request} from 'express'
import {
  IUser,
  IAuthorizer,
  IUserInput,
} from './interface'


export default class RootResolver {
  constructor() {
  }

  echo({message}: {message: string}, req: Request): string {
    return `received ${message}`
  }

  async user(query: {id?: string, username?: string}): Promise<IUser> {
    const users = await this._findUsers(query)
    if(users.length != 0) {
      return users[0]
    } else {
      return null
    }
  }

  async users(): Promise<IUser[]> {
    return await this._findUsers({})
  }

  /**
   * Mutation
   */
  async createUser({input}: {input: IUserInput}): Promise<IUser> {
    const knex = await database()
    const ids: any[] = await knex('user').insert(input)
    return await this.user({id: ids[0]})
  }

  /**
   * protected
   */
  protected async _findUsers(query?: any): Promise<IUser[]> {
    const knex = await database()
    const users: IUser[] = await knex('user')
      .select('id', 'username', 'email').where(query)
    return users
  }
}