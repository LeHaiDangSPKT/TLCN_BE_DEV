import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumberString, IsOptional, MinLength } from "class-validator";
import { ProductBillDto } from "./product-bill.dto";
import { PAYMENT_METHOD } from "../payment/payment.gateway";
import mongoose, { Types } from "mongoose";
import { example } from "yargs";

export class ProductInfo {
    @ApiProperty()
    @IsNotEmpty()
    productId: string;

    @ApiProperty()
    @IsNotEmpty()
    quantity: number;

    @ApiProperty()
    @IsNotEmpty()
    type: string;

}

export class CartInfo {
    @ApiProperty()
    @IsNotEmpty()
    storeId: string;

    @ApiProperty({ type: [ProductInfo] })
    @IsNotEmpty()
    listProducts: ProductInfo[];

    @ApiProperty()
    @IsOptional()
    notes: string;

    @ApiProperty()
    @IsNotEmpty()
    totalPrice: number;
}

export class ReceiverInfo {
    @ApiProperty()
    @IsNotEmpty()
    fullName: string;

    @ApiProperty()
    @IsNotEmpty()
    phoneNumber: string;

    @ApiProperty()
    @IsNotEmpty()
    address: string;
}

export class GiveInfo {
    @ApiProperty()
    @IsNotEmpty()
    senderName: string;

    @ApiProperty()
    @IsOptional()
    wish: string;
}

class GiveInfoExample {
    @ApiProperty({example: "Van A"})
    senderName: string;

    @ApiProperty({example: "wish something"})
    wish: string;
}

export class CreateBillDto {

    @ApiProperty({ type: [CartInfo] })
    @IsNotEmpty()
    data: CartInfo[];

    @ApiProperty()
    @IsNotEmpty()
    deliveryMethod: string;

    @ApiProperty({ type: String })
    @IsNotEmpty()
    paymentMethod: PAYMENT_METHOD;

    @ApiProperty({ type: ReceiverInfo })
    @IsNotEmpty()
    receiverInfo: ReceiverInfo;

    @ApiProperty({ type: GiveInfo || null , example: GiveInfoExample || null})
    @IsOptional()
    giveInfo: GiveInfo | null;

    @ApiProperty()
    @IsNotEmpty()
    deliveryFee: number;
}