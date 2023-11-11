import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumberString, MinLength } from "class-validator";
import mongoose, { Types } from "mongoose";

export class EmojiDto {
    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    name: string;
}