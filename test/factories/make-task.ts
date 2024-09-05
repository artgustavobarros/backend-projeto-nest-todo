import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Task, TaskProps } from '@/domain/enterprise/entities/task'
import { PrismaTaskMapper } from '@/infra/database/prisma/mappers/prisma-task-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeTask(
  override: Partial<TaskProps> = {},
  id?: UniqueEntityId,
) {
  const task = Task.create(
    {
      authorId: new UniqueEntityId(),
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph({ min: 1, max: 3 }),
      category: 'green',
      status: 'undone',
      ...override,
    },
    id,
  )

  return task
}

@Injectable()
export class TaskFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaTask(data: Partial<TaskProps> = {}): Promise<Task> {
    const task = makeTask(data)

    await this.prisma.task.create({ data: PrismaTaskMapper.toPrisma(task) })

    return task
  }
}
