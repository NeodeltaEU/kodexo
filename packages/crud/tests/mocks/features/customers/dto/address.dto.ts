import { IsString } from 'class-validator'

export class AddressDto {
  @IsString()
  street: string

  @IsString()
  city: string

  @IsString()
  postalCode: string
}
