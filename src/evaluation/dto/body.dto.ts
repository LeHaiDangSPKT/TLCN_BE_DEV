import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumberString, MinLength } from "class-validator";
import mongoose, { Types } from "mongoose";

export class BodyDto {
    @ApiProperty()
    @IsNotEmpty()
    body: string;
}