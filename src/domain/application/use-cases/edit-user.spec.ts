import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { EditUserUseCase } from './edit-user'
import { makeUser } from 'test/factories/make-user'
import { FakeHasher } from 'test/cryptograph/fake-hasher'

let usersRepository: InMemoryUsersRepository
let sut: EditUserUseCase
let hasher: FakeHasher

describe('Edit User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    hasher = new FakeHasher()
    sut = new EditUserUseCase(usersRepository, hasher)
  })

  it('should be possible to edit the name of an existing user.', async () => {
    const user = makeUser()

    usersRepository.create(user)

    await sut.execute({ id: user.id.toString(), newName: 'updated_name' })

    expect(usersRepository.items[0]).toMatchObject({
      name: 'updated_name',
    })
  })

  it('should be possible to edit the email of an existing user.', async () => {
    const user = makeUser()

    usersRepository.create(user)

    await sut.execute({
      id: user.id.toString(),
      newEmail: 'updated_email@email.com',
    })

    expect(usersRepository.items[0]).toMatchObject({
      email: 'updated_email@email.com',
    })
  })

  it('should be possible to edit the password of an existing user.', async () => {
    const user = makeUser()

    usersRepository.create(user)

    await sut.execute({
      id: user.id.toString(),
      newPassword: 'updated_password',
    })

    expect(usersRepository.items[0]).toMatchObject({
      password: 'updated_password-hashed',
    })
  })
})
