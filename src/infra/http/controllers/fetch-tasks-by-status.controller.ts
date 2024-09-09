import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'

import { ResourceNotFoundError } from '@/domain/application/use-cases/errors/resource-not-found-error'
import { TaskPresenter } from '../presenters/task-presenter'
import { FetchTasksByStatusUseCase } from '@/domain/application/use-cases/fetch-tasks-by-status'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'

const findTasksByStatusParamsSchema = z.object({
  status: z.enum(['done', 'undone']),
})

type FindTasksByStatusParamsSchema = z.infer<
  typeof findTasksByStatusParamsSchema
>
const paramsValidationPipeline = new ZodValidationPipe(
  findTasksByStatusParamsSchema,
)

@Controller('/tasks/status/:status')
export class FetchTasksByStatusController {
  constructor(private fetchTasksByStatus: FetchTasksByStatusUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Param(paramsValidationPipeline) params: FindTasksByStatusParamsSchema,
  ) {
    const { status } = params
    const result = await this.fetchTasksByStatus.execute({ status })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const foundedTasks = result.value.tasks

    return { tasks: foundedTasks.map(TaskPresenter.toHTTP) }
  }
}
