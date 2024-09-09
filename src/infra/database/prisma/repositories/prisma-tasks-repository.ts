import { TasksRepository } from '@/domain/application/repositories/tasks-repository'
import { Category, Status, Task } from '@/domain/enterprise/entities/task'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaTaskMapper } from '../mappers/prisma-task-mapper'

@Injectable()
export class PrismaTasksRepository implements TasksRepository {
  constructor(private prisma: PrismaService) {}

  async create(task: Task): Promise<void> {
    const data = PrismaTaskMapper.toPrisma(task)

    await this.prisma.task.create({ data })
  }

  async delete(task: Task): Promise<void> {
    const data = PrismaTaskMapper.toPrisma(task)

    await this.prisma.task.delete({ where: { id: data.id } })
  }

  async save(task: Task): Promise<void> {
    const data = PrismaTaskMapper.toPrisma(task)

    await this.prisma.task.update({
      where: { id: data.id },
      data,
    })
  }

  async findById(id: string): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({ where: { id } })

    if (!task) return null

    return PrismaTaskMapper.toDomain(task)
  }

  async fetchByStatus(status: Status): Promise<Task[] | null> {
    const tasks = await this.prisma.task.findMany({
      where: {
        status,
      },
    })

    if (!tasks) return null

    return tasks.map(PrismaTaskMapper.toDomain)
  }

  async fetchAll(): Promise<Task[] | null> {
    const tasks = await this.prisma.task.findMany()

    if (!tasks) return null

    return tasks.map(PrismaTaskMapper.toDomain)
  }

  async fetchByCategory(category: Category): Promise<Task[] | null> {
    const tasks = await this.prisma.task.findMany({
      where: {
        category,
      },
    })

    if (!tasks) return null

    return tasks.map(PrismaTaskMapper.toDomain)
  }
}
