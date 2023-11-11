import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: true,
})
export class Policy {
    @Prop()
    name: string;

    @Prop()
    content: string;
}

export const PolicySchema = SchemaFactory.createForClass(Policy);

