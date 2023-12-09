import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateProductDto {
    @ApiProperty({type: [String]})
    avatar: string[];

    @ApiProperty()
    quantity: number;

    @ApiProperty()
    productName: string;

    @ApiProperty()
    price: number;

    @ApiProperty()
    description: string;

    @ApiProperty()
    categoryId: string;

    @ApiProperty({type: [String]})
    keywords: string[];

    status: boolean = true;
}