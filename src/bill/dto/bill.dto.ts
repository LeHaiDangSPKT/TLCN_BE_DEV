import { PAYMENT_METHOD } from "../payment/payment.gateway";
import { Store } from "src/store/schema/store.schema";
import { Product } from "src/product/schema/product.schema";
import { GiveInfo, ProductInfo, ReceiverInfo } from "./create-bill.dto";
import { User } from "src/user/schema/user.schema";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class ProductFullInfo {
    product: Product;
    subInfo: ProductInfo;
}

export class BillDto {
    @ApiProperty()
    @IsNotEmpty()
    _id: string;

    @ApiProperty()
    @IsNotEmpty()
    storeInfo: Store;

    @ApiProperty({ type: [ProductFullInfo] })
    @IsNotEmpty()
    listProductsFullInfo: ProductFullInfo[];

    @ApiProperty()
    @IsNotEmpty()
    userInfo: User;

    @ApiProperty()
    @IsOptional()
    notes: string;

    @ApiProperty()
    @IsNotEmpty()
    totalPrice: number;

    @ApiProperty()
    @IsNotEmpty()
    deliveryMethod: string;
    
    @ApiProperty({ type: String })
    @IsNotEmpty()
    paymentMethod: PAYMENT_METHOD;

    @ApiProperty({ type: ReceiverInfo })
    @IsNotEmpty()
    receiverInfo: ReceiverInfo;

    @ApiProperty({ type: GiveInfo || null})
    @IsOptional()
    giveInfo: GiveInfo | null;

    @ApiProperty()
    @IsNotEmpty()
    deliveryFee: number;

    @ApiProperty()
    @IsNotEmpty()
    status: string;

    @ApiProperty()
    @IsNotEmpty()
    isPaid: boolean;

    // @ApiProperty()
    // @IsNotEmpty()
    // createdAt: Date;
}