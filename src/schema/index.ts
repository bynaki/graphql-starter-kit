/**
 * typedefs
 */

import {GraphQLSchema, buildSchema} from 'graphql'
import * as glob from 'glob'
import {readFileSync} from 'fs'
import {resolve} from 'path'
import RootResolver from './resolvers/RootResolver'

const matches = glob.sync('typedefs/**/*.+(graphql|gql)', {cwd: __dirname})
const typeDefs = matches.reduce((pre, match) => {
  return pre + '\n' + readFileSync(resolve(__dirname, match)).toString()
}, '')

export const schema = buildSchema(typeDefs)
export {RootResolver}
