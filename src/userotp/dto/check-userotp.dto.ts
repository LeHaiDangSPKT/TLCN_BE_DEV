import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class CheckUserotpDto {
    @ApiProperty()
    @IsNotEmpty()
    otp: Number;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;
}