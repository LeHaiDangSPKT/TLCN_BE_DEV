import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { ObjectId, Document, Types } from "mongoose";

@Schema({
    timestamps: true,
})
export class Product extends Document {
    @Prop({type: [String]})
    avatar: string[];

    @Prop()
    quantity: number;

    @Prop()
    productName: string;

    @Prop()
    price: number;

    @Prop()
    description: string;

    @Prop()
    category: string;

    @Prop({type: [String]})
    keywords: string[];

    @Prop()
    type: string;

    @Prop({default: true})
    status: boolean;

    @Prop()
    storeId: string;

    @Prop()
    storeName: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

