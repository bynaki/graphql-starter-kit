/**
 * test
 */

import * as request from 'supertest'
import {expect} from 'chai'
import {Server} from '../app'

describe('test app', () => {
  const server = request(new Server().application.listen(1818))

  it('echo', done => {
    server.post('/graphql')
    .send({
      query: `
      {
        re: echo(message: "Hello World")
      }
      `,
    })
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      if(err) throw err
      expect(res.body).to.be.a('object')
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.have.property('re')
      expect(res.body.data.re).to.equal('received Hello World')
      done()
    })
  })

  it('createAuthor', done => {
    server.post('/graphql')
    .send({
      query: `
      mutation {
        bynaki: createAuthor(
          name: "bynaki"
          email: "bynaki@icloud.com"
        ) {
          id
          name
          email
        }
        pythonaki: createAuthor(
          name: "pythonaki"
          email: "pythonaki@icloud.com"
        ) {
          id
          name
          email
        }
        rozio: createAuthor(
          name: "rozio"
          email: "rozio@icloud.com"
        ) {
          id
          name
          email
        }
      }
      `,
    })
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      if(err) throw err
      expect(res.body).to.be.a('object')
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.have.property('bynaki')
      expect(res.body.data.bynaki).to.deep.equal({
        id: res.body.data.bynaki.id,
        name: 'bynaki',
        email: 'bynaki@icloud.com',
      })
      done()
    })
  })

  it('author', done => {
    server.post('/graphql')
    .send({
      query: `
      {
        author(name: "bynaki") {
          name
          email
        }
      }
      `,
    })
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      if(err) throw err
      expect(res.body).to.be.a('object')
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.have.property('author')
      expect(res.body.data.author).to.deep.equal({
        name: 'bynaki',
        email: 'bynaki@icloud.com',
      })
      done()
    })
  })

  it('authors', done => {
    server.post('/graphql')
    .send({
      query: `
      {
        authors {
          id
          name
          email
        }
      }
      `,
    })
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      if(err) throw err
      expect(res.body).to.be.a('object')
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.have.property('authors')
      expect(res.body.data.authors).to.deep.equal([
        {id: '1', name: 'bynaki', email: 'bynaki@icloud.com'},
        {id: '2', name: 'pythonaki', email: 'pythonaki@icloud.com'},
        {id: '3', name: 'rozio', email: 'rozio@icloud.com'},
      ])
      done()
    })
  })
})