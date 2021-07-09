import { Length } from 'class-validator'

export class CreateWorkshopDto {
  @Length(10)
  title: string
}
