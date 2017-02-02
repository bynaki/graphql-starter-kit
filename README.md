# GraphQL Starter Kit


## Usage

```bash
$ npm start
$ npm run start.watch
$ npm test
$ npm run test.watch
$ npm run build
$ npm run clear
```


## URL

GraphQL:
- url: http://localhost:3000/graphql
- method: post
- query(json): {query: {re: echo(message: "Hello")}}
- data(json): {"data": {"re": "recieved Hello"}}

GraphiQL:
- url: http://localhost:3000/graphiql



## d.ts

```bash
$ npm install --save @types/node
```


## Remote Debugging

```bash
$ node --debug=5858 app.js  # 서버측 실행 5858 port
# or
$ node --debug-brk app.js   # 첫번째 라인에서 브레이크, 대기
```


## Reference

- [GraphQL](http://graphql.org)
- [Apollo GraphQL Client](http://dev.apollodata.com)
- [Knex](http://knexjs.org)


## License

Copyright (c) bynaki. All rights reserved.

Licensed under the MIT License.