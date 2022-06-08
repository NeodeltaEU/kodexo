import { ApiProperty } from '@kodexo/openapi'
import { IsString } from 'class-validator'

export class CommonCarDto {
  @ApiProperty({
    description: 'Test description',
    example: 'A name for example',
    required: true
  })
  @IsString()
  name: string
}
