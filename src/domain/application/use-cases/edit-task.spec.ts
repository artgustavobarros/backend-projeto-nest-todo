import { InMemoryTasksRepository } from 'test/repositories/in-memory-tasks-repository'
import { EditTaskUseCase } from './edit-task'
import { makeTask } from 'test/factories/make-task'

let tasksRepository: InMemoryTasksRepository
let sut: EditTaskUseCase
describe('Edit Task Use Case', () => {
  beforeEach(() => {
    tasksRepository = new InMemoryTasksRepository()
    sut = new EditTaskUseCase(tasksRepository)
  })

  it('should be possible to edit the name of an existing task.', async () => {
    const task = makeTask({
      title: 'Example task',
    })

    tasksRepository.create(task)

    await sut.execute({ id: task.id.toString(), title: 'Example task' })

    expect(tasksRepository.items[0]).toMatchObject({
      title: 'Example task',
    })
  })

  it('should be possible to edit the email of an existing task.', async () => {
    const task = makeTask({
      content: 'example content',
    })

    tasksRepository.create(task)

    await sut.execute({
      id: task.id.toString(),
      content: 'example content',
    })

    expect(tasksRepository.items[0]).toMatchObject({
      content: 'example content',
    })
  })

  it('should be possible to edit the status of an existing task.', async () => {
    const task = makeTask()

    tasksRepository.create(task)

    await sut.execute({
      id: task.id.toString(),
      status: 'done',
    })

    expect(tasksRepository.items[0]).toMatchObject({
      status: 'done',
    })
  })

  it('should be possible to edit the category of an existing task.', async () => {
    const task = makeTask()

    tasksRepository.create(task)

    await sut.execute({
      id: task.id.toString(),
      category: 'red',
    })

    expect(tasksRepository.items[0]).toMatchObject({
      category: 'red',
    })
  })
})
