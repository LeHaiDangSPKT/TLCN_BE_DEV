import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    avatar: string;

    @ApiProperty()
    @IsNotEmpty()
    fullName: string;

    @ApiProperty()
    @IsNotEmpty()
    address: string;

    @ApiProperty()
    @IsNotEmpty()
    phone: string;

    @ApiProperty()
    @IsNotEmpty()
    gender: string;

    @ApiProperty({ type: Date })
    @IsNotEmpty()
    birthday: Date;

    @IsNotEmpty()
    wallet: number;

    @ApiProperty()
    @IsNotEmpty()
    status: boolean;

}


