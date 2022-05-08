import { Controller } from '@kodexo/common'
import { Crud, CrudControllerInterface } from '@kodexo/crud'
import { Inject } from '@kodexo/injection'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import { UsersService } from './users.service'

@Crud({
  model: User,
  dto: {
    createDto: CreateUserDto,
    updateDto: UpdateUserDto
  }
})
@Controller('/users')
export class UsersController implements CrudControllerInterface<User> {
  constructor(@Inject public service: UsersService) {}
}
