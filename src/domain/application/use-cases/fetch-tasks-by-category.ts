import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { Category, Task } from '@/domain/enterprise/entities/task'
import { TasksRepository } from '../repositories/tasks-repository'
import { Injectable } from '@nestjs/common'

interface FetchTasksByCategoryRequest {
  category: Category
}

type FetchTasksByCategoryUseCaseResponse = Either<
  ResourceNotFoundError,
  { tasks: Task[] }
>

@Injectable()
export class FetchTasksByCategoryUseCase {
  constructor(private tasksRepository: TasksRepository) {}

  async execute({
    category,
  }: FetchTasksByCategoryRequest): Promise<FetchTasksByCategoryUseCaseResponse> {
    const tasks = await this.tasksRepository.fetchByCategory(category)

    if (!tasks) return left(new ResourceNotFoundError())

    return right({ tasks })
  }
}
