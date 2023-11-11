import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class AddressProfileDto {
    @IsNotEmpty()
    name: string;

    default: boolean = true;
}