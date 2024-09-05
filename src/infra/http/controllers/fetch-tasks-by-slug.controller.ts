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
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { FetchTaskBySlugUseCase } from '@/domain/application/use-cases/fetch-tasks-by-slug'

const findTasksBySlugParamsSchema = z.object({
  slug: z.string(),
})

type FindTasksBySlugParamsSchema = z.infer<typeof findTasksBySlugParamsSchema>
const paramsValidationPipeline = new ZodValidationPipe(
  findTasksBySlugParamsSchema,
)

@Controller('/tasks/search/:slug')
export class FetchTasksBySlugController {
  constructor(private fetchTasksBySlug: FetchTaskBySlugUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Param(paramsValidationPipeline) params: FindTasksBySlugParamsSchema,
  ) {
    const { slug } = params
    const result = await this.fetchTasksBySlug.execute({ slug })

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
