import { Category, Status, Task } from '@/domain/enterprise/entities/task'

export abstract class TasksRepository {
  abstract create(task: Task): Promise<void>
  abstract save(task: Task): Promise<void>
  abstract delete(task: Task): Promise<void>
  abstract fetchAll(): Promise<Task[] | null>
  abstract findById(id: string): Promise<Task | null>
  abstract fetchByStatus(status: Status): Promise<Task[] | null>
  abstract fetchByCategory(category: Category): Promise<Task[] | null>
}
