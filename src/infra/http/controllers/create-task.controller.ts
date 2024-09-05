import { Body, Controller, Post } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { CreateTaskUseCase } from '@/domain/application/use-cases/create-task'

const createTaskBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  category: z.enum(['green', 'yellow', 'red']),
})

const bodyValidationPipe = new ZodValidationPipe(createTaskBodySchema)

type CreateTaskBodySchema = z.infer<typeof createTaskBodySchema>

@Controller('/tasks')
export class CreateTaskController {
  constructor(private createTask: CreateTaskUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateTaskBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, content, category } = body
    const authorId = user.sub

    await this.createTask.execute({ content, title, authorId, category })
  }
}
