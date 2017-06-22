/**
 * utils
 */

import * as Knex from 'knex'
import {resolve} from 'path'
import {createHmac} from 'crypto'
import cf from './config'


/**
 * 데이터 베이스 가져오기 (Knex)
 */
export async function database(): Promise<Knex> {
  if(_knex) {
    return _knex
  }
  const knex = Knex({
    client: 'sqlite3',
    connection: {
      filename: resolve(__dirname, 'mydb.sqlite'),
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
let _knex = null


/**
 * graphql에서 쓰는 Error 메시지 포멧과 똑같이
 */
export class GraphqlErrorMessageList {
  private _errors: MyErrorFormat[]

  constructor(error: MyErrorFormat = null) {
    this._errors = []
    if(error) {
      this.push(error)
    }
  }

  push(error: MyErrorFormat): GraphqlErrorMessageList {
    this._errors.push({
      message: error.message,
      statusCode: error.statusCode
    })
    return this
  }

  get errors(): MyErrorFormat[] {
    return this._errors
  }
}

/**
 * sha1 암호화
 */
export function encrypt(src: string): string {
  return createHmac('sha1', cf.jwt.secret)
          .update(src)
          .digest('base64')
}

/**
 * status code 와 함께 Error 객체
 */
export class ErrorWithStatusCode extends Error implements MyErrorFormat {
  constructor(public message: string, public statusCode: number = 500) {
    super(message)
  }
}

/**
 * 밖으로 내보낼 Error 포멧
 */
export interface MyErrorFormat {
  message: string
  statusCode?: number
}