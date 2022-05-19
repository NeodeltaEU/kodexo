import { ApiProperty } from '@kodexo/openapi'

export class CommonCarDto {
  @ApiProperty({
    description: 'Test description',
    example: 'A name for example',
    required: true
  })
  name: string
}
