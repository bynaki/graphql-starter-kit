/**
 * resolvers's interfaces
 */

export interface IUser {
  id: string
  username: string
  email: string
}

export interface IAuthorizer extends IUser {
  phone: string
}

export interface IUserInput {
  username: string
  password: string
  email: string
  phone?: string
}