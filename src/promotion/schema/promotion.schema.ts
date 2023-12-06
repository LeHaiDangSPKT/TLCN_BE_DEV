import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { ObjectId, Document, Types } from "mongoose";

@Schema({
    timestamps: true,
})
export class Promotion extends Document {
    @Prop()
    photo: string[];

    @Prop()
    promotionName: string;

    @Prop()
    content: string;

    @Prop()
    value: number;

    @Prop()
    days: number;

    @Prop()
    productTypes: string[];

    @Prop({ default: true })
    status: boolean
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);

