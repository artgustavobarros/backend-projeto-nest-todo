import { Task } from '@/domain/enterprise/entities/task'
import { TasksRepository } from '../repositories/tasks-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface FetchTaskBySlugUseCaseRequest {
  slug: string
}

type FetchTaskBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    tasks: Task[]
  }
>

@Injectable()
export class FetchTaskBySlugUseCase {
  constructor(private tasksRepository: TasksRepository) {}

  async execute({
    slug,
  }: FetchTaskBySlugUseCaseRequest): Promise<FetchTaskBySlugUseCaseResponse> {
    const tasks = await this.tasksRepository.findBySlug(slug)

    if (!tasks) return left(new ResourceNotFoundError())

    return right({ tasks })
  }
}
