import { Either, left, right } from '@/core/either'
import { TasksRepository } from '../repositories/tasks-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface DeleteTaskUseCaseRequest {
  id: string
}

type DeleteTaskUseCaseResponse = Either<ResourceNotFoundError, object>

@Injectable()
export class DeleteTaskUseCase {
  constructor(private tasksRepository: TasksRepository) {}

  async execute({
    id,
  }: DeleteTaskUseCaseRequest): Promise<DeleteTaskUseCaseResponse> {
    const task = await this.tasksRepository.findById(id)

    if (!task) return left(new ResourceNotFoundError())

    await this.tasksRepository.delete(task)

    return right({})
  }
}
