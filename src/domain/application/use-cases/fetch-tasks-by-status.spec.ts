import { InMemoryTasksRepository } from 'test/repositories/in-memory-tasks-repository'
import { makeTask } from 'test/factories/make-task'
import { FetchTasksByStatusUseCase } from './fetch-tasks-by-status'

let tasksRepository: InMemoryTasksRepository
let sut: FetchTasksByStatusUseCase

describe('Fetch Tasks By Status Use Case', () => {
  beforeEach(() => {
    tasksRepository = new InMemoryTasksRepository()
    sut = new FetchTasksByStatusUseCase(tasksRepository)
  })

  it('should be able to fetch tasks by status', async () => {
    for (let i = 0; i < 10; i++) {
      const task = makeTask()
      if (i % 2 === 0) {
        task.status = 'done'
      }
      tasksRepository.create(task)
    }

    const result = await sut.execute({ status: 'done' })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) expect(result.value.tasks).toHaveLength(5)
  })
})
