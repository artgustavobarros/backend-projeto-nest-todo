import { Task } from '@/domain/enterprise/entities/task'
import { TasksRepository } from '../repositories/tasks-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

type FetchAllTasksUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    tasks: Task[]
  }
>

@Injectable()
export class FetchAllTasksUseCase {
  constructor(private tasksRepository: TasksRepository) {}

  async execute(): Promise<FetchAllTasksUseCaseResponse> {
    const tasks = await this.tasksRepository.fetchAll()

    if (!tasks) return left(new ResourceNotFoundError())

    return right({ tasks })
  }
}
