import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TokensDto } from './dto/tokens.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
    ) { }

    async getTokens(payload: any): Promise<TokensDto> {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_ACCESS_TOKEN_SECRET,
                expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES,
            }),
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_REFRESH_TOKEN_SECRET,
                expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES,
            }),
        ])
        return {
            accessToken: at,
            refreshToken: rt,
        }
    }

    async hashData(data: string): Promise<string> {
        const saltOrRounds = Number(process.env.SALT_ROUNDS)
        return await bcrypt.hash(data, saltOrRounds)
    }

    async compareData(data: string, hashedData: string): Promise<boolean> {
        const isMatched = await bcrypt.compare(data, hashedData)
        return isMatched
    }
}
