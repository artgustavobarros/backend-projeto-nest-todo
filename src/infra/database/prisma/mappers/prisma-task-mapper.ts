import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Task } from '@/domain/enterprise/entities/task'
import { Slug } from '@/domain/enterprise/entities/value-objects/slug'
import { Prisma, Task as PrismaTask } from '@prisma/client'

export class PrismaTaskMapper {
  static toDomain(raw: PrismaTask): Task {
    return Task.create(
      {
        title: raw.title,
        content: raw.content,
        authorId: new UniqueEntityId(raw.authorId),
        slug: Slug.create(raw.slug),
        status: raw.status,
        category: raw.category,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(task: Task): Prisma.TaskUncheckedCreateInput {
    return {
      id: task.id.toString(),
      authorId: task.authorId.toString(),
      content: task.content,
      title: task.title,
      status: task.status,
      category: task.category,
      slug: task.slug.value,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }
  }
}
