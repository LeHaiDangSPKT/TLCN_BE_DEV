import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserotpDto {
    @ApiProperty()
    @IsNotEmpty()
    email: string;
}