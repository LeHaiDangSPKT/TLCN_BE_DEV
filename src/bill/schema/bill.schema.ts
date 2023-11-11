import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { ObjectId, Document, Types } from "mongoose";
import { ProductBillDto } from "../dto/product-bill.dto";

@Schema({
    timestamps: true,
})
export class Bill extends Document {
    @Prop()
    userId: string;

    @Prop()
    fullName: string;

    @Prop()
    email: string;

    @Prop()
    phone: string;

    @Prop()
    address: string;

    @Prop()
    storeId: string;

    @Prop()
    storeName: string;

    @Prop({ type: [Object] })
    listProducts: ProductBillDto[];

    @Prop()
    totalPrice: number;

    @Prop()
    promotionId: string;

    @Prop()
    promotionName: string;

    @Prop()
    promotionValue: number;

    @Prop()
    paymentMethod: string;

    @Prop({ default: "Đã đặt" })
    status: string;


}

export const BillSchema = SchemaFactory.createForClass(Bill);

