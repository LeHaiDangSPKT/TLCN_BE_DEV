import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumberString, MinLength } from "class-validator";

export class UpdateStoreDto {
    @ApiProperty()
    avatar: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    address: string;

    @ApiProperty({type: [String]})
    phoneNumber: string[];
}