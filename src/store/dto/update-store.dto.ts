import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumberString, MinLength } from "class-validator";

export class UpdateStoreDto {
    @ApiProperty()
    @IsNotEmpty()
    avatar: string;

    @ApiProperty()
    @IsNotEmpty()
    storeName: string;

    @ApiProperty()
    @IsNotEmpty()
    address: string;

    @ApiProperty({type: [String]})
    @IsNotEmpty()
    phone: string[];
}