import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsNotEmpty } from "class-validator";
import mongoose, { Document, ObjectId } from "mongoose";

@Schema({
    timestamps: true,
})
export class UserToken extends Document {
    @Prop()
    @IsNotEmpty()
    userId: string;

    @Prop()
    hashedRefreshToken: string;
}

export const UserTokenSchema = SchemaFactory.createForClass(UserToken);

