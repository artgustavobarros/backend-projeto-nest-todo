import { EditUserUseCase } from '@/domain/application/use-cases/edit-user'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Patch,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { UserNotFoundError } from '@/domain/application/use-cases/errors/user-not-found-error'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

const updateUserSchema = z.object({
  newEmail: z.string().optional(),
  newName: z.string().optional(),
  newPassword: z.string().optional(),
})

type UpdateUserSchema = z.infer<typeof updateUserSchema>

@Controller('/users/update')
export class EditUserController {
  constructor(private editUser: EditUserUseCase) {}

  @Patch()
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(updateUserSchema))
  async handle(
    @Body() body: UpdateUserSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { newEmail, newName, newPassword } = body
    const id = user.sub

    const result = await this.editUser.execute({
      newEmail,
      newName,
      newPassword,
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
  }
}
