import { makeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { FakeHasher } from 'test/cryptograph/fake-hasher'
import { AuthenticateUserUseCase } from './authenticate'
import { FakeEncrypter } from 'test/cryptograph/fake-encrypter'
import { CredentialsNotValidError } from './errors/credentials-not-valid-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let hasher: FakeHasher
let encrypter: FakeEncrypter
let sut: AuthenticateUserUseCase

describe('Authenticate User Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    hasher = new FakeHasher()
    encrypter = new FakeEncrypter()
    sut = new AuthenticateUserUseCase(
      inMemoryUsersRepository,
      hasher,
      encrypter,
    )
  })

  it('should be able to authenticate a user', async () => {
    inMemoryUsersRepository.create(
      makeUser({
        email: 'john_doe@email.com',
        password: await hasher.hash('123456'),
      }),
    )

    const result = await sut.execute({
      email: 'john_doe@email.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight())
      expect(result.value).toEqual({
        accessToken: expect.any(String),
      })
  })

  it('should not be able to authenticate a user with wrong email', async () => {
    inMemoryUsersRepository.create(
      makeUser({
        email: 'john_doe@email.com',
        password: await hasher.hash('123456'),
      }),
    )

    const result = await sut.execute({
      email: 'wrong_email@email.com',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(CredentialsNotValidError)
  })

  it('should not be able to authenticate a user with wrong password', async () => {
    inMemoryUsersRepository.create(
      makeUser({
        email: 'john_doe@email.com',
        password: await hasher.hash('123456'),
      }),
    )

    const result = await sut.execute({
      email: 'john_doe@email.com',
      password: 'wrong_password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(CredentialsNotValidError)
  })
})
