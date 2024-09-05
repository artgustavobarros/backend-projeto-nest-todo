import { InMemoryTasksRepository } from 'test/repositories/in-memory-tasks-repository'
import { makeTask } from 'test/factories/make-task'
import { FetchTasksByCategoryUseCase } from './fetch-tasks-by-category'

let tasksRepository: InMemoryTasksRepository
let sut: FetchTasksByCategoryUseCase

describe('Fetch Tasks By Category Use Case', () => {
  beforeEach(() => {
    tasksRepository = new InMemoryTasksRepository()
    sut = new FetchTasksByCategoryUseCase(tasksRepository)
  })

  it('should be able to fetch tasks by status', async () => {
    for (let i = 0; i < 10; i++) {
      const task = makeTask({ category: `${i % 2 === 0 ? 'yellow' : 'red'}` })
      tasksRepository.create(task)
    }

    const result = await sut.execute({ category: 'yellow' })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) expect(result.value.tasks).toHaveLength(5)
  })
})
