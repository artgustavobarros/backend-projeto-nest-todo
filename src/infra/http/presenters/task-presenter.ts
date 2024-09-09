import { Task } from '@/domain/enterprise/entities/task'

export class TaskPresenter {
  static toHTTP(task: Task) {
    return {
      id: task.id.toString(),
      authorId: task.authorId.toString(),
      title: task.title,
      content: task.content,
      category: task.category,
      status: task.status,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }
  }
}
