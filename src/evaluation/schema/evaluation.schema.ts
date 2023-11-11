import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { EmojiDto } from "../dto/emoji.dto";

@Schema({
    timestamps: true,
})
export class Evaluation extends Document {
    @Prop()
    productId: string;

    @Prop({ type: [Object], default: [] })
    Emojis: EmojiDto[];
}

export const EvaluationSchema = SchemaFactory.createForClass(Evaluation);

