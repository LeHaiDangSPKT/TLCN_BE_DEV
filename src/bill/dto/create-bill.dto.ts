import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumberString, MinLength } from "class-validator";
import { ProductBillDto } from "./product-bill.dto";
import { PAYMENT_METHOD } from "../payment/payment.gateway";
import mongoose, { Types } from "mongoose";

export class CreateBillDto {

    @ApiProperty()
    @IsNotEmpty()
    listProductId: string[];

    @ApiProperty()
    @IsNotEmpty()
    address: string;

    @ApiProperty()
    promotionId: string;

    @ApiProperty()
    promotionName: string;

    @ApiProperty()
    promotionValue: number;

    @ApiProperty({ type: String })
    @IsNotEmpty()
    paymentMethod: PAYMENT_METHOD;
}