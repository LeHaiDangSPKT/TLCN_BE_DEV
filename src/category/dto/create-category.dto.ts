import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty()
    @IsNotEmpty()
    url: string;

    @ApiProperty()
    @IsNotEmpty()
    name: string;
}