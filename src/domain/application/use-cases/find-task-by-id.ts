import { Task } from '@/domain/enterprise/entities/task'
import { TasksRepository } from '../repositories/tasks-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface FindTaskByIdUseCaseRequest {
  id: string
}

type FindTaskByIdUseCaseResponse = Either<ResourceNotFoundError, { task: Task }>

@Injectable()
export class FindTaskByIdUseCase {
  constructor(private tasksRepository: TasksRepository) {}

  async execute({
    id,
  }: FindTaskByIdUseCaseRequest): Promise<FindTaskByIdUseCaseResponse> {
    const task = await this.tasksRepository.findById(id)

    if (!task) return left(new ResourceNotFoundError())

    return right({ task })
  }
}
