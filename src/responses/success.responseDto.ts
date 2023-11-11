import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto {
  @ApiProperty({ description: 'A message describing the success response', type: String })
  message: string;

  @ApiProperty({ description: 'The HTTP status code of the success response', type: Number })
  status: number;

  @ApiProperty({ description: 'Additional metadata for the success response', type: Object })
  metadata: Record<string, any>;
}
