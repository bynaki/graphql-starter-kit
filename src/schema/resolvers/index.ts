/**
 * resolvers
 */

import * as Knex from 'knex'
import {resolve} from 'path'

export interface Author {
  id: string 
  name: string
  email: string
}

let knex: Knex
function getKnex(): Promise<Knex> {
  if(knex) {
    return Promise.resolve(knex)
  }
  knex = Knex({
    client: 'sqlite3',
    connection: {
      filename: resolve(__dirname, '../../mydb.sqlite'),
    }
  })
  return (async () => {
    await knex.schema.dropTableIfExists('test')
    await knex.schema.createTable('test', (table) => {
      table.increments('id')
      table.string('name')
      table.string('email')
    })
    return Promise.resolve(knex)
  })()
}

export default {
  RootQuery: {
    author(root, {name}): Promise<Author> {
      return (async (): Promise<Author> => {
        const knex = await getKnex()
        const rows: Author[] = await knex('test').select().where({name})
        if(rows.length != 0) {
          return rows[0]
        } else {
          return null
        }
      })()
    },

    authors(root): Promise<Author[]> {
      return (async (): Promise<Author[]> => {
        const knex = await getKnex()
        return await knex('test').select()
      })()
    },

    echo(root, {message}) {
      return `received ${message}`
    },
  },

  RootMutation: {
    createAuthor(root, {name, email}): Promise<Author> {
      return (async (): Promise<Author> => {
        const knex = await getKnex()
        const ids: any[] = await knex('test').insert({name, email})
        const authors: Author[] = await knex('test').select().where({id: ids[0]})
        return authors[0]
      })()
    },
  },
}