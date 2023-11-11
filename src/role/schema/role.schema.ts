import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

export enum RoleName {
    USER = 'User',
    SELLER = 'Seller',
    MANAGER = 'Manager',
    ADMIN = 'Admin',
}

@Schema({
    timestamps: true,
})
export class Role extends Document {
    @Prop({ type: String })
    name: RoleName;

    @Prop({ type: [String], default: [] })
    listUser: string[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);

