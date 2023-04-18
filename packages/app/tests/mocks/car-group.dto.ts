import { IsOptional, IsString, Max, Min } from 'class-validator'

export class CarGroupDto {
  @Min(2)
  @Max(4, { groups: ['admin'] })
  tires: number

  @IsOptional()
  @IsString({ groups: ['admin'] })
  name: string
}
