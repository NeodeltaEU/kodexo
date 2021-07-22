import { IsString, MinLength } from 'class-validator'

export class CarDto {
  @IsString()
  name: string
}
