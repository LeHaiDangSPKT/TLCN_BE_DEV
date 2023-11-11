import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumberString, MinLength } from "class-validator";
import mongoose from "mongoose";
import { ProductBillDto } from "src/bill/dto/product-bill.dto";

export class CreateCartDto {
    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    storeId: string;

    @IsNotEmpty()
    storeName: string;

    @IsNotEmpty()
    listProducts: ProductBillDto[];

    @IsNotEmpty()
    totalPrice: number;
}