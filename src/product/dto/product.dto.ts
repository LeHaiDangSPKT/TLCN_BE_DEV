import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ProductDto {
    @ApiProperty()
    @IsNotEmpty()
    _id: string;

    @ApiProperty({type: [String]})
    @IsNotEmpty()
    avatar: string[];

    @ApiProperty()
    @IsNotEmpty()
    quantity: number;

    @ApiProperty()
    @IsNotEmpty()
    productName: string;

    @ApiProperty()
    @IsNotEmpty()
    price: number;

    @ApiProperty()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    @IsNotEmpty()
    category: string;

    @ApiProperty({type: [String]})
    @IsNotEmpty()
    keywords: string[];

    @ApiProperty()
    @IsNotEmpty()
    type: string;

    @ApiProperty()
    @IsNotEmpty()
    storeId: string;

    
    @ApiProperty()
    @IsNotEmpty()
    storeName: string;

}