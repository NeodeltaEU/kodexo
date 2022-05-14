import { ApiProperty } from '@kodexo/app'
import { BaseSerialized } from '@kodexo/crud'
import { Expose, Type } from 'class-transformer'
import { UserSerialized } from '../../users/serializations/user.serialized'

export class CarSerialized extends BaseSerialized {
  @ApiProperty()
  @Expose()
  name: string

  @ApiProperty()
  @Type(() => UserSerialized)
  @Expose()
  owner: UserSerialized
}
