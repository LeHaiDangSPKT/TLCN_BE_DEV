import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { AddressProfileDto } from "./address-profile.dto";

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    avatar: string;

    @ApiProperty()
    @IsNotEmpty()
    fullName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail({}, { message: "Email is invalid" })
    email: string;

    @ApiProperty()
    password: string;

    @ApiProperty({ type: [AddressProfileDto] })
    @IsNotEmpty()
    address: AddressProfileDto[];

    @ApiProperty()
    @IsNotEmpty()
    phone: string;

    @ApiProperty()
    @IsNotEmpty()
    gender: string;

    @ApiProperty({ type: Date })
    @IsNotEmpty()
    birthday: Date;

    @ApiProperty({ type: [String] })
    @IsNotEmpty()
    friends: String[];

    @ApiProperty({ type: [String] })
    @IsNotEmpty()
    followStores: String[];

    @ApiProperty()
    @IsNotEmpty()
    warningCount: number;

    @ApiProperty()
    @IsNotEmpty()
    status: boolean;
}