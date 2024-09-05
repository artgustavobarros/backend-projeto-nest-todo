import { InMemoryTasksRepository } from 'test/repositories/in-memory-tasks-repository'
import { FetchTaskBySlugUseCase } from './fetch-tasks-by-slug'
import { makeUser } from 'test/factories/make-user'
import { makeTask } from 'test/factories/make-task'

let tasksRepository: InMemoryTasksRepository
let sut: FetchTaskBySlugUseCase

describe('Fetch a quest by slug', () => {
  beforeEach(() => {
    tasksRepository = new InMemoryTasksRepository()
    sut = new FetchTaskBySlugUseCase(tasksRepository)
  })

  it('should be able to find a quest by slug', async () => {
    const user = makeUser()

    for (let i = 0; i < 20; i++) {
      const newTask = makeTask({
        authorId: user.id,
        content: 'test content',
        title: `${i % 2 === 0 ? 'title-example' : 'text-example'}`,
      })

      tasksRepository.create(newTask)
    }

    const result = await sut.execute({ slug: 'title' })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) expect(result.value.tasks).toHaveLength(10)
  })
})
