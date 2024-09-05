import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { Status, Task } from '@/domain/enterprise/entities/task'
import { TasksRepository } from '../repositories/tasks-repository'
import { Injectable } from '@nestjs/common'

interface FetchTasksByStatusRequest {
  status: Status
}

type FetchTasksByStatusUseCaseResponse = Either<
  ResourceNotFoundError,
  { tasks: Task[] }
>

@Injectable()
export class FetchTasksByStatusUseCase {
  constructor(private tasksRepository: TasksRepository) {}

  async execute({
    status,
  }: FetchTasksByStatusRequest): Promise<FetchTasksByStatusUseCaseResponse> {
    const tasks = await this.tasksRepository.fetchByStatus(status)

    if (!tasks) return left(new ResourceNotFoundError())

    return right({ tasks })
  }
}
