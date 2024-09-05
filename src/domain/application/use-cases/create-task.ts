import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Category, Task } from '../../enterprise/entities/task'
import { TasksRepository } from '../repositories/tasks-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface CreateTaskUseCaseRequest {
  authorId: string
  title: string
  content: string
  category: Category
}

type CreateTaskUseCaseResponse = Either<
  null,
  {
    task: Task
  }
>

@Injectable()
export class CreateTaskUseCase {
  constructor(private tasksRepository: TasksRepository) {}

  async execute({
    content,
    title,
    authorId,
    category,
  }: CreateTaskUseCaseRequest): Promise<CreateTaskUseCaseResponse> {
    const task = Task.create({
      content,
      title,
      status: 'undone',
      category: category ?? 'green',
      authorId: new UniqueEntityId(authorId),
    })

    await this.tasksRepository.create(task)

    return right({ task })
  }
}
