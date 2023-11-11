import { IsNotEmpty } from "class-validator";
import { UserWithoutPassDto } from "src/user/dto/user-without-pass.dto";

export class TokensDto {
    @IsNotEmpty()
    accessToken: string;

    @IsNotEmpty()
    refreshToken: string;
}