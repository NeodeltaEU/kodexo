import { Type } from 'class-transformer'
import { IsEmail, IsString, ValidateNested } from 'class-validator'
import { IsUnique } from '../../../../../src'
import { Customer } from '../entities/customer.entity'
import { AddressDto } from './address.dto'

export class UpdateCustomerDto {
  @IsString()
  name: string

  @IsEmail()
  @IsUnique(Customer)
  email: string

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto
}
