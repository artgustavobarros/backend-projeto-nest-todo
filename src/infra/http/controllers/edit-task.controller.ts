import { EditTaskUseCase } from '@/domain/application/use-cases/edit-task'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { ResourceNotFoundError } from '@/domain/application/use-cases/errors/resource-not-found-error'

const updateTaskBodySchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  status: z.enum(['done', 'undone']).optional(),
  category: z.enum(['green', 'yellow', 'red']).optional(),
})

const updateTaskParamsSchema = z.object({
  id: z.string(),
})

type UpdateTaskBodySchema = z.infer<typeof updateTaskBodySchema>
const bodyValidationPipe = new ZodValidationPipe(updateTaskBodySchema)
type UpdateTaskParamsSchema = z.infer<typeof updateTaskParamsSchema>
const paramsValidationPipe = new ZodValidationPipe(updateTaskParamsSchema)

@Controller()
export class EditTaskController {
  constructor(private editTask: EditTaskUseCase) {}

  @Patch('/tasks/update/:id')
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: UpdateTaskBodySchema,
    @Param(paramsValidationPipe) params: UpdateTaskParamsSchema,
  ) {
    const { title, content, status, category } = body
    const { id } = params

    const result = await this.editTask.execute({
      id,
      title,
      content,
      status,
      category,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
