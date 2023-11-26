import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class AddressProfileDto {
    @ApiProperty()
    @IsOptional()
    receiverName: string;

    @ApiProperty()
    @IsOptional()
    receiverPhone: string;

    @ApiProperty()
    @IsNotEmpty()
    address: string;

    default: boolean = true;
}