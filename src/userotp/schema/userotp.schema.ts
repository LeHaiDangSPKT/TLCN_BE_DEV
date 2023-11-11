import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { ObjectId, Document, Types } from "mongoose";

@Schema({
    timestamps: true,
})
export class Userotp extends Document {
    @Prop({ type: String })
    email: string;

    @Prop({ type: Number })
    otp: Number;

}

export const UserotpSchema = SchemaFactory.createForClass(Userotp);

