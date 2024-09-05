import { UseCaseError } from '@/core/errors/use-case-error'

export class UserWithSameCredentialsError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('User with same credentials already exists')
  }
}
