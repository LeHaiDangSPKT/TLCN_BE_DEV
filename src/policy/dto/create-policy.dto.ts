import { ApiProperty } from "@nestjs/swagger";

export class CreatePolicyDto {
    @ApiProperty()
    readonly name: string;

    @ApiProperty()
    readonly content: string;
}