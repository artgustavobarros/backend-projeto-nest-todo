import { CreateTaskUseCase } from './create-task'
import { InMemoryTasksRepository } from 'test/repositories/in-memory-tasks-repository'

let inMemoryTasksRepository: InMemoryTasksRepository
let sut: CreateTaskUseCase

describe('Create Task', () => {
  beforeEach(() => {
    inMemoryTasksRepository = new InMemoryTasksRepository()
    sut = new CreateTaskUseCase(inMemoryTasksRepository)
  })

  it('should be able to create a task', async () => {
    const result = await sut.execute({
      authorId: '1',
      content: 'test',
      title: 'test',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryTasksRepository.items[0]).toEqual(result.value?.task)
  })
})
