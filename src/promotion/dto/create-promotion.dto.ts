import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreatePromotionDto {
    @ApiProperty()
    @IsNotEmpty()
    avatar: string;

    @ApiProperty()
    @IsNotEmpty()
    promotionName: string;

    @ApiProperty()
    @IsNotEmpty()
    content: string;

    @ApiProperty()
    @IsNotEmpty()
    value: number;

    @ApiProperty()
    @IsNotEmpty()
    days: number;

    @ApiProperty()
    @IsNotEmpty()
    productTypes: string[];

    @ApiProperty()
    @IsNotEmpty()
    status: boolean

}