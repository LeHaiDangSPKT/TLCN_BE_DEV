import { ApiProperty } from "@nestjs/swagger";

export class AddIdDto {
    @ApiProperty()
    id: string;
}