import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumberString, MinLength } from "class-validator";

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

    @ApiProperty({type: [String]})
    @IsNotEmpty()
    phoneNumber: string[];
}