import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ description: 'The name of the error', type: String })
  name: string;

  @ApiProperty({ description: 'The HTTP status code of the error response', type: Number })
  code: number;

  @ApiProperty({ description: 'The error message', type: String })
  message: string;

  @ApiProperty({ description: 'The stack trace (only in non-production environments)', type: String })
  stack: string;
}
