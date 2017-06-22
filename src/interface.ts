/**
 * resolvers's interfaces
 */

export interface User {
  id: string
  username: string
  email: string
}

export interface Authorizer extends User {
  password: string
  phone: string
}

export interface AuthInput {
  username: string
  password: string
}

export interface UserInput extends AuthInput {
  email: string
  phone?: string
}


export interface DecodedToken {
  id: string
  username: string
  email: string
  iat: number   // 생성시간
  exp: number   // 만료시간
  iss: string   // 토큰 발급자
  sub: string   // 토큰 제목
}

export interface JwtConfig {
  secret: string        // 비밀키
  options: {
    expiresIn: string   // 만료 기간
    issuer: string      // 발급자
    subject: string     // 제목
  }
}