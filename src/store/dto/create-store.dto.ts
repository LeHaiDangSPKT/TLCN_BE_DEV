import { ApiConsumes, ApiProperty } from "@nestjs/swagger";
import { File } from "buffer";
import { IsEmail, IsNotEmpty, IsNumberString, MinLength } from "class-validator";
import { HasMimeType, IsFile } from "nestjs-form-data";

export class CreateStoreDto {
    @ApiProperty()
    @IsNotEmpty()
    avatar: string;

    @ApiProperty()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    @IsNotEmpty()
    address: string;

    @ApiProperty({ type: [String] })
    @IsNotEmpty()
    phoneNumber: string[];
}