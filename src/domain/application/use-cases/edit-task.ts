import { Either, left, right } from '@/core/either'
import { TasksRepository } from '../repositories/tasks-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { Category, Status } from '@/domain/enterprise/entities/task'

interface EditTaskUseCaseRequest {
  id: string
  title?: string
  content?: string
  category?: Category
  status?: Status
}

type EditTaskUseCaseResponse = Either<ResourceNotFoundError, object>

@Injectable()
export class EditTaskUseCase {
  constructor(private tasksRepository: TasksRepository) {}

  async execute({
    id,
    title,
    content,
    category,
    status,
  }: EditTaskUseCaseRequest): Promise<EditTaskUseCaseResponse> {
    const task = await this.tasksRepository.findById(id)

    if (!task) return left(new ResourceNotFoundError())

    task.title = title ?? task.title
    task.content = content ?? task.content
    task.status = status ?? task.status
    task.category = category ?? task.category

    await this.tasksRepository.save(task)

    return right({})
  }
}
