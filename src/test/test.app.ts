/**
 * test
 */

import * as request from 'supertest'
import {expect} from 'chai'
import {Server} from '../app'
import promisify from 'fourdollar.promisify'

describe('test app', () => {
  const server = request(new Server().application.listen(1818))

  it('echo', done => {
    server.post('/graphql')
    .set('x-access-token', 'this is token')
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

  it('createUser', done => {
    server.post('/graphql')
    .send({
      query: `
      mutation {
        bynaki: createUser(input: {
          username: "bynaki"
          password: "pwd"
          email: "bynaki@email.com"
          phone: "010-0000-0000"
        }) {
          id
          username
          email
        }
        hello: createUser(input: {
          username: "hello"
          password: "pwd"
          email: "hello@email.com"
          phone: "010-111-1111"
        }) {
          id
          username
          email
        }
        foobar: createUser(input: {
          username: "foobar"
          password: "pwd"
          email: "foobar@email.com"
          phone: "010-222-3333"
        }) {
          id
          username
          email
        }
      }
      `
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
        username: 'bynaki',
        email: 'bynaki@email.com',
      })
      expect(res.body.data.hello.username).to.be.equal('hello')
      expect(res.body.data.foobar.email).to.be.equal('foobar@email.com')
      done()
    })
  })

  it('user', done => {
    server.post('/graphql')
    .send({
      query: `
      {
        user(username: "bynaki") {
          username
          email
        }
      }
      `
    })
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      if(err) throw err
      expect(res.body).to.be.a('object')
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.have.property('user') 
      expect(res.body.data.user).to.deep.equal({
        username: 'bynaki',
        email: 'bynaki@email.com',
      })
      done()
    })
  })

  it('users', done => {
    server.post('/graphql')
    .send({
      query: `
      {
        users {
          id
          username
          email
        }
      }
      `
    })
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      if(err) throw err
      expect(res.body).to.be.a('object')
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.have.property('users')
      expect(res.body.data.users).to.have.lengthOf(3)
      done()
    })
  })
})