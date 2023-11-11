import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { ObjectId, Document, Types } from "mongoose";

@Schema({
    timestamps: true,
})
export class Category extends Document {
    @Prop()
    name: string;

    @Prop()
    url: string;

    @Prop({ default: true })
    status: boolean
}

export const CategorySchema = SchemaFactory.createForClass(Category);

