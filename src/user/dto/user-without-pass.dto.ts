import { AddressProfileDto } from "./address-profile.dto";

export class UserWithoutPassDto {
    _id: string;
    avatar: string;
    fullName: string;
    email: string;
    address: AddressProfileDto[];
    phone: string;
    gender: string;
    birthday: Date;
    friends: String[];
    followStores: String[];
    warningCount: number;
    status: boolean;
}