import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateFineDto {
    @ApiProperty()
    @IsNotEmpty()
    time: number;

    @ApiProperty()
    @IsNotEmpty()
    content: string
}