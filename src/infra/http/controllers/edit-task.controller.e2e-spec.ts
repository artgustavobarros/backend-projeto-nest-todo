import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { TaskFactory } from 'test/factories/make-task'
import { UserFactory } from 'test/factories/make-user'

describe('Edit task (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let taskFactory: TaskFactory
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, TaskFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    userFactory = moduleRef.get(UserFactory)
    taskFactory = moduleRef.get(TaskFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[PATCH] /tasks/update/:id', async () => {
    const user = await userFactory.makePrismaUser()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const task = await taskFactory.makePrismaTask({ authorId: user.id })

    const taskId = task.id.toString()

    const response = await request(app.getHttpServer())
      .patch(`/tasks/update/${taskId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'updated_title',
      })

    expect(response.statusCode).toBe(204)

    const taskOnDatabase = await prisma.task.findUnique({
      where: { id: taskId },
    })

    expect(taskOnDatabase).toMatchObject({
      title: 'updated_title',
    })
  })
})
