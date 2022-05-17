import { Controller } from '@kodexo/common'
import { Crud, CrudControllerInterface } from '@kodexo/crud'
import { Inject } from '@kodexo/injection'
import { ApiGroup } from '@kodexo/openapi'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import { UserSerialized } from './serializations/user.serialized'
import { UsersService } from './users.service'

@Crud({
  model: User,
  serialization: UserSerialized,
  dto: {
    createDto: CreateUserDto,
    updateDto: UpdateUserDto
  }
})
@ApiGroup('Users')
@Controller('/users')
export class UsersController implements CrudControllerInterface<User> {
  constructor(@Inject public service: UsersService) {}
}
