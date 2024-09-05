import { User } from '@/domain/enterprise/entities/user'
import { UsersRepository } from '../repositories/users-repository'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { UserWithSameCredentialsError } from './errors/user-with-same-credentials-error'
import { Hasher } from '../cryptography/hasher'

interface CreateUserUseCaseRequest {
  name: string
  email: string
  password: string
}

type CreateUserUseCaseResponse = Either<
  UserWithSameCredentialsError,
  {
    user: User
  }
>

@Injectable()
export class CreateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: Hasher,
  ) {}

  async execute({
    name,
    email,
    password,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) return left(new UserWithSameCredentialsError())

    const hashedPassword = await this.hashGenerator.hash(password)

    const user = User.create({ name, email, password: hashedPassword })

    await this.usersRepository.create(user)

    return right({ user })
  }
}
