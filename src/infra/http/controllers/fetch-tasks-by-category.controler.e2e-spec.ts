import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { TaskFactory } from 'test/factories/make-task'
import { UserFactory } from 'test/factories/make-user'

describe('Fetch tasks by category (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let taskFactory: TaskFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, TaskFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    userFactory = moduleRef.get(UserFactory)
    taskFactory = moduleRef.get(TaskFactory)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[GET] /tasks/category/:category', async () => {
    const user = await userFactory.makePrismaUser()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    await Promise.all([
      taskFactory.makePrismaTask({ authorId: user.id, category: 'red' }),
      taskFactory.makePrismaTask({ authorId: user.id, category: 'red' }),
      taskFactory.makePrismaTask({ authorId: user.id, category: 'green' }),
      taskFactory.makePrismaTask({ authorId: user.id, category: 'yellow' }),
    ])

    const response = await request(app.getHttpServer())
      .get('/tasks/category/red')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      tasks: [
        expect.objectContaining({ category: 'red' }),
        expect.objectContaining({ category: 'red' }),
      ],
    })
  })
})
