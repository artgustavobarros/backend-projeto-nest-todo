import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { FindUserByIdUseCase } from './find-user-by-id'
import { makeUser } from 'test/factories/make-user'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { UserNotFoundError } from './errors/user-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: FindUserByIdUseCase

describe('Find user by id Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new FindUserByIdUseCase(usersRepository)
  })

  it('should be able to find a user with existent id', async () => {
    const id = new UniqueEntityId('mock-id')
    const mockUser = makeUser({}, id)

    usersRepository.create(mockUser)

    const result = await sut.execute({ id: mockUser.id.toString() })

    expect(result.isRight()).toBe(true)
  })

  it('should not be able to find a user with a inexistent id', async () => {
    const mockUser = makeUser({})

    usersRepository.create(mockUser)

    const result = await sut.execute({ id: 'wrong-id' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserNotFoundError)
  })
})
