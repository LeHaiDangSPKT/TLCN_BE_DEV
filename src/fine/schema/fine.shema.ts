import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsNotEmpty } from "class-validator";
import mongoose, { ObjectId, Document, Types } from "mongoose";

@Schema({
    timestamps: true,
})
export class Fine extends Document {
    //     - Số lần
    // - Hình thức phạt

    @Prop()
    @IsNotEmpty()
    times: number

    @Prop()
    @IsNotEmpty()
    content: string

}

export const FineSchema = SchemaFactory.createForClass(Fine);

