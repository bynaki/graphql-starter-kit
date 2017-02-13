import * as Knex from 'knex'
import {resolve} from 'path'
import {createHmac} from 'crypto'
import {secret} from './config'


let _knex = null
export async function database(): Promise<Knex> {
  if(_knex) {
    return _knex
  }
  const knex = Knex({
    client: 'sqlite3',
    connection: {
      filename: resolve(__dirname, '../../mydb.sqlite'),
    }
  })
  await knex.schema.dropTableIfExists('user')
  await knex.schema.createTable('user', (table) => {
    table.increments('id')
    table.string('username')
    table.string('password')
    table.string('email')
    table.string('phone')
  })
  _knex = knex
  return knex
}


export class GraphqlErrors {
  private _errors: {message: string}[]

  constructor(message: string = null) {
    this._errors = []
    if(message !== null) {
      this.push(message)
    }
  }

  push(message: string): GraphqlErrors {
    this._errors.push({message})
    return this
  }

  get errors(): {message: string}[] {
    return this._errors 
  }
}

export function encrypt(src: string): string {
  return createHmac('sha1', secret)
          .update(src)
          .digest('base64')
}
