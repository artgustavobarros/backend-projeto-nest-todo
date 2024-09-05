import { makeUser } from 'test/factories/make-user'
import { CreateUserUseCase } from './create-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { UserWithSameCredentialsError } from './errors/user-with-same-credentials-error'
import { FakeHasher } from 'test/cryptograph/fake-hasher'

let inMemoryUsersRepository: InMemoryUsersRepository
let hasher: FakeHasher
let sut: CreateUserUseCase

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    hasher = new FakeHasher()
    sut = new CreateUserUseCase(inMemoryUsersRepository, hasher)
  })

  it('should be able to create a user', async () => {
    const result = await sut.execute({
      name: 'john_doe',
      email: 'john_doe@email.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight())
      expect(inMemoryUsersRepository.items[0]).toEqual(result.value?.user)
  })

  it('should not be able to create two users with same email', async () => {
    inMemoryUsersRepository.create(makeUser({ email: 'johndoe@email.com' }))

    const result = await sut.execute({
      name: 'john_doe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserWithSameCredentialsError)
  })

  it('should be able to hash a password upon user creation', async () => {
    const result = await sut.execute({
      name: 'john_doe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUsersRepository.items[0]).toMatchObject({
      password: '123456-hashed',
    })
  })
})
