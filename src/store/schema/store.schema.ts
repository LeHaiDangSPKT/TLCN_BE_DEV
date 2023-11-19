import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { ObjectId, Document, Types } from "mongoose";

@Schema({
    timestamps: true,
})
export class Store extends Document {
    @Prop()
    userId: string;

    @Prop()
    avatar: string;

    @Prop()
    name: string;

    @Prop()
    address: string;

    @Prop({types: [String]})
    phoneNumber: string[];

    @Prop()
    description: string;

    @Prop({ default: 0 })
    warningCount: number;

    @Prop({ default: true })
    status: boolean
}

export const StoreSchema = SchemaFactory.createForClass(Store);

