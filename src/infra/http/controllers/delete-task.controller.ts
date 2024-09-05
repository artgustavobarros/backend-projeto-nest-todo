import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { ResourceNotFoundError } from '@/domain/application/use-cases/errors/resource-not-found-error'
import { DeleteTaskUseCase } from '@/domain/application/use-cases/delete-task'

const updateTaskParamsSchema = z.object({
  id: z.string(),
})

type UpdateTaskParamsSchema = z.infer<typeof updateTaskParamsSchema>
const paramsValidationPipe = new ZodValidationPipe(updateTaskParamsSchema)

@Controller()
export class DeleteTaskController {
  constructor(private deleteTask: DeleteTaskUseCase) {}

  @Delete('/tasks/delete/:id')
  @HttpCode(204)
  async handle(@Param(paramsValidationPipe) params: UpdateTaskParamsSchema) {
    const { id } = params

    const result = await this.deleteTask.execute({ id })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
