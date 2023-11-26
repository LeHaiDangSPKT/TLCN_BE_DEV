import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { AddressProfileDto } from './address-profile.dto';

export class UpdateUserDto {
    @ApiProperty()
    @IsOptional()
    avatar: string;

    @ApiProperty()
    @IsOptional()
    fullName: string;

    @ApiProperty({ type: [AddressProfileDto] })
    @IsOptional()
    address: AddressProfileDto[];

    @ApiProperty()
    @IsOptional()
    phone: string;

    @ApiProperty()
    @IsOptional()
    gender: string;

    @ApiProperty({ type: Date })
    @IsOptional()
    birthday: Date;

    @ApiProperty()
    @IsOptional()
    wallet: number;

    @ApiProperty()
    @IsOptional()
    status: boolean;

}


