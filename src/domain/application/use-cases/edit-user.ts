import { Either, left, right } from '@/core/either'
import { UsersRepository } from '../repositories/users-repository'
import { UserNotFoundError } from './errors/user-not-found-error'
import { Injectable } from '@nestjs/common'
import { Hasher } from '../cryptography/hasher'

interface EditUserUseCaseRequest {
  email: string
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
    email,
    newPassword,
  }: EditUserUseCaseRequest): Promise<EditUserUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) return left(new UserNotFoundError())

    if (newPassword)
      user.password = (await this.hasher.hash(newPassword)) ?? user.password

    await this.usersRepository.save(user)

    return right({})
  }
}
