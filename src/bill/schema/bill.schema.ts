import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { ObjectId, Document, Types } from "mongoose";
import { ProductBillDto } from "../dto/product-bill.dto";
import { GiveInfo, ProductInfo, ReceiverInfo } from "../dto/create-bill.dto";


export const BILL_STATUS = "NEW-CONFIRMED-DELIVERING-DELIVERED-CANCELLED-RETURNED"


@Schema({
    timestamps: true,
})
export class Bill extends Document {
    @Prop()
    userId: string;

    @Prop()
    storeId: string;

    @Prop({ type: [Object] })
    listProducts: ProductInfo[];

    @Prop()
    notes: string;

    @Prop()
    totalPrice: number;

    @Prop()
    deliveryMethod: string;

    @Prop()
    paymentMethod: string;

    @Prop({ type: Object })
    receiverInfo: ReceiverInfo;

    @Prop({ type: Object || null })
    giveInfo: GiveInfo | null;

    @Prop()
    deliveryFee: number;

    @Prop({ default: "NEW" })
    status: string;

    @Prop()
    isPaid: boolean;
}

export const BillSchema = SchemaFactory.createForClass(Bill);

