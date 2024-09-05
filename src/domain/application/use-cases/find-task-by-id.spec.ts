import { InMemoryTasksRepository } from 'test/repositories/in-memory-tasks-repository'
import { FindTaskByIdUseCase } from './find-task-by-id'
import { makeTask } from 'test/factories/make-task'
import { makeUser } from 'test/factories/make-user'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let tasksRepository: InMemoryTasksRepository
let sut: FindTaskByIdUseCase

describe('Find task by id Use Case', () => {
  beforeEach(() => {
    tasksRepository = new InMemoryTasksRepository()
    sut = new FindTaskByIdUseCase(tasksRepository)
  })

  it('should be able to find a task with existent id', async () => {
    const user = makeUser()

    const mockTask = makeTask({ authorId: user.id })

    tasksRepository.create(mockTask)

    const result = await sut.execute({ id: mockTask.id.toString() })

    expect(result.isRight()).toBe(true)
  })

  it('should not be able to find a task with a inexistent id', async () => {
    const user = makeUser()

    const mockTask = makeTask({ authorId: user.id })

    tasksRepository.create(mockTask)

    const result = await sut.execute({ id: 'wrong-id' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
