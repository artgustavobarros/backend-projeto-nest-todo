import { User } from '@/domain/enterprise/entities/user'
import { UsersRepository } from '../repositories/users-repository'
import { Either, left, right } from '@/core/either'
import { UserNotFoundError } from './errors/user-not-found-error'
import { Injectable } from '@nestjs/common'

interface FindUserByIdUseCaseRequest {
  id: string
}

type FindUserByIdUseCaseResponse = Either<
  UserNotFoundError,
  {
    user: User
  }
>

@Injectable()
export class FindUserByIdUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    id,
  }: FindUserByIdUseCaseRequest): Promise<FindUserByIdUseCaseResponse> {
    const user = await this.usersRepository.findById(id)

    if (!user) return left(new UserNotFoundError())

    return right({ user })
  }
}
