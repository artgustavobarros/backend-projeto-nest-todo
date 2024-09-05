import { FindTaskByIdUseCase } from '@/domain/application/use-cases/find-task-by-id'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { ResourceNotFoundError } from '@/domain/application/use-cases/errors/resource-not-found-error'
import { TaskPresenter } from '../presenters/task-presenter'

const findTaskByIdParamsSchema = z.object({
  id: z.string(),
})

type FindTaskByIdParamsSchema = z.infer<typeof findTaskByIdParamsSchema>
const paramsValidationPipeline = new ZodValidationPipe(findTaskByIdParamsSchema)

@Controller('/tasks/:id')
export class FindTaskByIdController {
  constructor(private findTaskById: FindTaskByIdUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Param(paramsValidationPipeline) params: FindTaskByIdParamsSchema,
  ) {
    const { id } = params

    const result = await this.findTaskById.execute({ id })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const task = result.value.task

    return { task: TaskPresenter.toHTTP(task) }
  }
}
