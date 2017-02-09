/**
 * typedefs
 */

import {GraphQLSchema, buildSchema} from 'graphql'
import * as glob from 'glob'
import {readFileSync} from 'fs'
import {resolve} from 'path'

const matches = glob.sync('**/*.+(graphql|gql)', {cwd: __dirname})
const typeDefs = matches.reduce((pre, match) => {
  return pre + '\n' + readFileSync(resolve(__dirname, match)).toString()
}, '')

export default buildSchema(typeDefs)