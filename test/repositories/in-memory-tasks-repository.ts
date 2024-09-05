import { TasksRepository } from '@/domain/application/repositories/tasks-repository'
import { Category, Status, Task } from '@/domain/enterprise/entities/task'

export class InMemoryTasksRepository implements TasksRepository {
  public items: Task[] = []

  async create(task: Task): Promise<void> {
    this.items.push(task)
  }

  async fetchAll(): Promise<Task[] | null> {
    if (this.items.length !== 0) return this.items

    return null
  }

  async findById(id: string): Promise<Task | null> {
    const task = this.items.find((item) => item.id.toString() === id)

    if (!task) return null

    return task
  }

  async fetchByStatus(status: Status): Promise<Task[] | null> {
    const tasks = this.items.filter((item) => item.status === status)

    if (!tasks) return null

    return tasks
  }

  async findBySlug(slug: string): Promise<Task[] | null> {
    const tasks = this.items.filter((item) => item.slug.value.includes(slug))

    if (!tasks) return null

    return tasks
  }

  async delete(task: Task): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === task.id)

    this.items.splice(itemIndex, 1)
  }

  async save(task: Task): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === task.id)

    this.items[itemIndex] = task
  }

  async fetchByCategory(category: Category): Promise<Task[] | null> {
    const tasks = this.items.filter((item) => item.category === category)

    if (!tasks) return null

    return tasks
  }
}
