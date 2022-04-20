import { TransformPlainToInstance, Type } from 'class-transformer'
import { IsString, ValidateNested } from 'class-validator'
import { AddressDto } from './address.dto'

export class CreateCustomerDto {
  @IsString()
  name: string

  @Type(() => AddressDto)
  @ValidateNested()
  address: AddressDto
}
