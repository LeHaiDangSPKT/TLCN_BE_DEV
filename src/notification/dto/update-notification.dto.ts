import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumberString, MinLength } from "class-validator";
import { SubNoti } from "./sub-notification.dto";

export class UpdateNotificationDto {
    @ApiProperty()
    fullName: string

    @ApiProperty()
    @IsNotEmpty()
    content: string

    @ApiProperty()
    @IsNotEmpty()
    status: boolean = true
}