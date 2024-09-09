import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { compare } from 'bcryptjs'
import request from 'supertest'
import { UserFactory } from 'test/factories/make-user'

describe('Edit user (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    userFactory = moduleRef.get(UserFactory)
    prisma = moduleRef.get(PrismaService)
    await app.init()
  })

  test('[PATCH] /users/update', async () => {
    const user = await userFactory.makePrismaUser()

    const response = await request(app.getHttpServer())
      .patch('/users/update')
      .send({
        email: user.email,
        newPassword: 'new_password',
      })

    expect(response.statusCode).toBe(204)

    const userOnDatabase = await prisma.user.findUnique({
      where: { id: user.id.toString() },
    })

    if (userOnDatabase) {
      const newPasswordMatches = await compare(
        'new_password',
        userOnDatabase.password,
      )

      expect(newPasswordMatches).toBe(true)
    }
  })
})
