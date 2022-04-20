import { IsString, ValidateNested } from 'class-validator'
import { AddressDto } from './address.dto'

export class UpdateCustomerDto {
  @IsString()
  name: string

  @ValidateNested()
  address: AddressDto
}
