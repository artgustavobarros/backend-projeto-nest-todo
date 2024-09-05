import { InMemoryTasksRepository } from 'test/repositories/in-memory-tasks-repository'
import { makeTask } from 'test/factories/make-task'
import { FetchAllTasksUseCase } from './fetch-all-tasks'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let tasksRepository: InMemoryTasksRepository
let sut: FetchAllTasksUseCase

describe('Fetch all tasks use case', () => {
  beforeEach(() => {
    tasksRepository = new InMemoryTasksRepository()
    sut = new FetchAllTasksUseCase(tasksRepository)
  })

  it('should be able to fetch all stasks', async () => {
    for (let i = 0; i < 10; i++) {
      const task = makeTask()
      tasksRepository.create(task)
    }

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)

    if (result.isRight()) expect(result.value.tasks).toHaveLength(10)
  })

  it('should not be able to fetch tasks by users with no tasks', async () => {
    const result = await sut.execute()

    expect(result.isLeft()).toBe(true)

    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
