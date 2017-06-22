/**
 * RootAuthResolver
 * 인증이 필요한 resolver
 */
import {database} from '../../utils'
import {Request} from 'express'
import RootResolver from './RootResolver'
import {
  User,
  Authorizer,
  UserInput,
  DecodedToken,
} from '../../interface'


export default class RootAuthResolver extends RootResolver {
  constructor(private _decodedToken: DecodedToken) {
    super()
  }

  async myProfile(): Promise<Authorizer> {
    const knex = await database()
    const users: Authorizer[] = await knex('user')
      .select().where({id: this._decodedToken.id})
    if(users.length === 0) {
      throw new Error('It is an unqualified authentication.')
    }
    return users[0]
  } 
}