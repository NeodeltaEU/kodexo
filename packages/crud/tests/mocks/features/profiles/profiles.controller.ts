import { Inject } from '@uminily/injection'
import { Controller } from '@uminily/common'
import { Crud, CrudControllerInterface, CrudService } from '../../../../src'
import { Profile } from './entities/profile.entity'
import { ProfilesService } from './profiles.service'
import { CreateProfileDto } from './dto/create-profile.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { LogMiddleware } from '../../middlewares/LogMiddleware'

@Crud({
  model: Profile,
  dto: {
    createDto: CreateProfileDto,
    updateDto: UpdateProfileDto
  },
  middlewares: {
    getMany: [LogMiddleware]
  }
})
@Controller('/profiles')
export class ProfilesController implements CrudControllerInterface<Profile> {
  constructor(@Inject public service: ProfilesService) {}
}
