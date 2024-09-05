import { Either, left, right } from '@/core/either'
import { UsersRepository } from '../repositories/users-repository'
import { UserNotFoundError } from './errors/user-not-found-error'
import { Injectable } from '@nestjs/common'
import { Hasher } from '../cryptography/hasher'

interface EditUserUseCaseRequest {
  id: string
  newEmail?: string
  newName?: string
  newPassword?: string
}

type EditUserUseCaseResponse = Either<UserNotFoundError, object>

@Injectable()
export class EditUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hasher: Hasher,
  ) {}

  async execute({
    id,
    newName,
    newEmail,
    newPassword,
  }: EditUserUseCaseRequest): Promise<EditUserUseCaseResponse> {
    const user = await this.usersRepository.findById(id)

    if (!user) return left(new UserNotFoundError())

    user.name = newName ?? user.name
    user.email = newEmail ?? user.email
    if (newPassword)
      user.password = (await this.hasher.hash(newPassword)) ?? user.password

    await this.usersRepository.save(user)

    return right({})
  }
}
