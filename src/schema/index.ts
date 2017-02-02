/**
 * schema
 * example: http://dev.apollodata.com/tools/graphql-tools/generate-schema.html
 * example: http://graphql.org/learn/schema/
 */


import {GraphQLSchema} from 'graphql'
import {makeExecutableSchema} from 'graphql-tools'
import resolvers from './resolvers'
import * as glob from 'glob'
import {readFileSync} from 'fs'
import {resolve} from 'path'

const matches = glob.sync('typedefs/**/*.+(graphql|gql)', {cwd: __dirname})
const typeDefs = matches.map((match) => {
  return readFileSync(resolve(__dirname, match)).toString()
})
export default makeExecutableSchema({typeDefs, resolvers})