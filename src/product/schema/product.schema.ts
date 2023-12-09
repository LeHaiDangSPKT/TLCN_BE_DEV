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
    categoryId: string;

    @Prop({type: [String]})
    keywords: string[];

    @Prop({default: true})
    status: boolean;

    @Prop()
    storeId: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

