import { BaseSerialized } from '@kodexo/crud'
import { ApiModel, ApiProperty } from '@kodexo/openapi'
import { Expose, Type } from 'class-transformer'
import { UserSerialized } from '../../users/serializations/user.serialized'

@ApiModel({
  title: 'Car'
})
export class CarSerialized extends BaseSerialized {
  @ApiProperty()
  @Expose()
  name: string

  @ApiProperty()
  @Expose()
  @Type(() => UserSerialized)
  owner: UserSerialized
}
