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
import { Public } from '@/infra/auth/public'

const updateUserSchema = z.object({
  email: z.string(),
  newPassword: z.string().optional(),
})

type UpdateUserSchema = z.infer<typeof updateUserSchema>

@Controller('/users/update')
@Public()
export class EditUserController {
  constructor(private editUser: EditUserUseCase) {}

  @Patch()
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(updateUserSchema))
  async handle(@Body() body: UpdateUserSchema) {
    const { email, newPassword } = body

    const result = await this.editUser.execute({
      email,
      newPassword,
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
