import { IsNumber, IsString, Validate } from 'class-validator'
import { Association, IsExist } from '../../../../../src'
import { Dealership } from '../../dealerships/entities/dealership.entity'
import { Car } from '../entities/car.entity'

export class UpdateCarDto {
  @IsString()
  title: string

  @IsNumber()
  doors: number

  @IsExist(Dealership)
  dealership: Association<Dealership>
}
