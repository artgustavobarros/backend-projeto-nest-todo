import { InMemoryTasksRepository } from 'test/repositories/in-memory-tasks-repository'
import { DeleteTaskUseCase } from './delete-task'
import { makeTask } from 'test/factories/make-task'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let tasksRepository: InMemoryTasksRepository
let sut: DeleteTaskUseCase

describe('Delete Task Use Case', () => {
  beforeEach(() => {
    tasksRepository = new InMemoryTasksRepository()
    sut = new DeleteTaskUseCase(tasksRepository)
  })

  it('should be able to delete a task', async () => {
    const task = makeTask()

    tasksRepository.create(task)

    await sut.execute({ id: task.id.toString() })

    expect(tasksRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a task with wrong id', async () => {
    const task = makeTask()

    tasksRepository.create(task)

    const result = await sut.execute({ id: 'wrong-id' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
