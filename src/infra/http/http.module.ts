import { Module } from '@nestjs/common'
import { CreateAccountController } from './controllers/create-account.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateTaskController } from './controllers/create-task.controller'
import { DatabaseModule } from '../database/database.module'
import { CreateTaskUseCase } from '@/domain/application/use-cases/create-task'
import { CreateUserUseCase } from '@/domain/application/use-cases/create-user'
import { AuthenticateUserUseCase } from '@/domain/application/use-cases/authenticate'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { EditUserController } from './controllers/edit-user.controller'
import { EditUserUseCase } from '@/domain/application/use-cases/edit-user'
import { EditTaskController } from './controllers/edit-task.controller'
import { EditTaskUseCase } from '@/domain/application/use-cases/edit-task'
import { DeleteTaskController } from './controllers/delete-task.controller'
import { DeleteTaskUseCase } from '@/domain/application/use-cases/delete-task'
import { FindUserByIdController } from './controllers/find-user-by-id.controller'
import { FindUserByIdUseCase } from '@/domain/application/use-cases/find-user-by-id'
import { FetchAllTasksController } from './controllers/fetch-all-tasks.controller'
import { FetchAllTasksUseCase } from '@/domain/application/use-cases/fetch-all-tasks'
import { FindTaskByIdController } from './controllers/find-task-by-id.controller'
import { FindTaskByIdUseCase } from '@/domain/application/use-cases/find-task-by-id'
import { FetchTasksByCategoryController } from './controllers/fetch-tasks-by-category.controller'
import { FetchTasksByCategoryUseCase } from '@/domain/application/use-cases/fetch-tasks-by-category'
import { FetchTasksByStatusController } from './controllers/fetch-tasks-by-status.controller'
import { FetchTasksByStatusUseCase } from '@/domain/application/use-cases/fetch-tasks-by-status'
import { FetchTasksBySlugController } from './controllers/fetch-tasks-by-slug.controller'
import { FetchTaskBySlugUseCase } from '@/domain/application/use-cases/fetch-tasks-by-slug'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateTaskController,
    EditUserController,
    EditTaskController,
    DeleteTaskController,
    FindUserByIdController,
    FetchAllTasksController,
    FindTaskByIdController,
    FetchTasksByCategoryController,
    FetchTasksByStatusController,
    FetchTasksBySlugController,
  ],
  providers: [
    CreateTaskUseCase,
    CreateUserUseCase,
    AuthenticateUserUseCase,
    EditUserUseCase,
    EditTaskUseCase,
    DeleteTaskUseCase,
    FindUserByIdUseCase,
    FetchAllTasksUseCase,
    FindTaskByIdUseCase,
    FetchTasksByCategoryUseCase,
    FetchTasksByStatusUseCase,
    FetchTaskBySlugUseCase,
  ],
})
export class HttpModule {}
