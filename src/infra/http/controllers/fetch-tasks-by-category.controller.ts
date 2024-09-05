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
import { FetchTasksByCategoryUseCase } from '@/domain/application/use-cases/fetch-tasks-by-category'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'

const findTasksByCategoryParamsSchema = z.object({
  category: z.enum(['green', 'yellow', 'red']),
})

type FindTasksByCategoryParamsSchema = z.infer<
  typeof findTasksByCategoryParamsSchema
>
const paramsValidationPipeline = new ZodValidationPipe(
  findTasksByCategoryParamsSchema,
)

@Controller('/tasks/category/:category')
export class FetchTasksByCategoryController {
  constructor(private fetchTasksByCategory: FetchTasksByCategoryUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Param(paramsValidationPipeline) params: FindTasksByCategoryParamsSchema,
  ) {
    const { category } = params
    const result = await this.fetchTasksByCategory.execute({ category })

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
