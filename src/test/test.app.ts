/**
 * test
 */

import {expect} from 'chai'
import * as request from 'supertest'
import {verify} from 'jsonwebtoken'
// import promisify from 'fourdollar.promisify'
import {Server} from '../app'
import {secret} from '../config'


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

  it('createToken', done => {
    server.post('/graphql')
    .send({
      query: `
      mutation {
        token: createToken(
          username: "bynaki"
          password: "pwd"
          expiresIn: "1s"
        )
      }
      `
    })
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      if(err) throw err
      expect(res.body.data).to.have.property('token')
      const token = res.body.data.token
      verify(token, secret, (err, decoded) => {
        if(err) throw err
        expect(decoded.username).to.be.equal('bynaki')
        expect(decoded.email).to.be.equal('bynaki@email.com')
        expect(decoded.exp - decoded.iat).to.be.equal(1)
        done()
      })
    })
  })

  it('인증되지 않은 상태에서 myProfile를 query하면 에러가 난다.', done => {
    server.post('/graphql')
    .send({
      query: `
      {
        myProfile {
          id
          username
          email
          phone
        }
      }
      `
    })
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      if(err) throw err
      expect(res.body.data.myProfile).to.be.null
      expect(res.body.errors[0].message).to.be.equal('must be authenticate!!')
      done()
    })
  })

  describe('인증상태: ', () => {
    let token
    before(done => {
      server.post('/graphql')
      .send({
        query: `
        mutation {
          token: createToken(
            username: "bynaki"
            password: "pwd"
            expiresIn: "1d"
          )
        }
        `
      })
      .end((err, res) => {
        if(err) throw err
        token = res.body.data.token
        done()
      })
    })

    it('aaa', () => {
        console.log('token: ', token)

    })
  })
})