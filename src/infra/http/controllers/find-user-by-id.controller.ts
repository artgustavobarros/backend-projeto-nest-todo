import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  UnauthorizedException,
} from '@nestjs/common'
import { UserNotFoundError } from '@/domain/application/use-cases/errors/user-not-found-error'
import { FindUserByIdUseCase } from '@/domain/application/use-cases/find-user-by-id'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { UserPresenter } from '../presenters/user-presenter'

@Controller('/users')
export class FindUserByIdController {
  constructor(private findUserById: FindUserByIdUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() user: UserPayload) {
    const id = user.sub

    const result = await this.findUserById.execute({
      id,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case UserNotFoundError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const foundUser = result.value.user

    return { user: UserPresenter.toHTTP(foundUser) }
  }
}
