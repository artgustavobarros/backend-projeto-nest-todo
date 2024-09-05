import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
} from '@nestjs/common'
import { FetchAllTasksUseCase } from '@/domain/application/use-cases/fetch-all-tasks'
import { ResourceNotFoundError } from '@/domain/application/use-cases/errors/resource-not-found-error'
import { TaskPresenter } from '../presenters/task-presenter'

@Controller('/tasks')
export class FetchAllTasksController {
  constructor(private fetchAllTasks: FetchAllTasksUseCase) {}

  @Get()
  @HttpCode(200)
  async handle() {
    const result = await this.fetchAllTasks.execute()

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
