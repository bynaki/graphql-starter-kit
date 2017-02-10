import * as Knex from 'knex'
import {resolve} from 'path'


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