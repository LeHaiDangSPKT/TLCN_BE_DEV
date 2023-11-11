import { Injectable, Type } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserToken } from './schema/usertoken.schema';
import { Model, MongooseError, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ForbiddenExceptionCustom } from 'src/exceptions/ForbiddenExceptionCustom.exception';
import { InternalServerErrorExceptionCustom } from 'src/exceptions/InternalServerErrorExceptionCustom.exception';

@Injectable()
export class UsertokenService {
    constructor(
        @InjectModel(UserToken.name)
        private readonly userTokenModel: Model<UserToken>,
    ) { }

    async hashData(data: string): Promise<string> {
        const saltOrRounds = Number(process.env.SALT_ROUNDS)
        return await bcrypt.hash(data, saltOrRounds)
    }

    async createUserToken(userId: string, refreshToken: string): Promise<UserToken> {
        const hashedRT = await this.hashData(refreshToken)
        try {
            const userToken = await this.userTokenModel.create({
                userId,
                hashedRefreshToken: hashedRT,
            })
            return userToken
        } catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async updateUserToken(userId: string, refreshToken: string): Promise<boolean> {
        try {
            const hashedRT = await this.hashData(refreshToken)
            const userToken = await this.userTokenModel.findOneAndUpdate(
                { userId },
                { hashedRefreshToken: hashedRT },
                { new: true },
            )
            if (!userToken) { throw new ForbiddenExceptionCustom() }
            return true
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async deleteUserToken(userId: string): Promise<boolean> {
        try {
            const userToken = await this.userTokenModel.findOneAndDelete({ userId })
            if (!userToken) { throw new ForbiddenExceptionCustom() }
            return true
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async getUserTokenById(userId: string): Promise<any> {
        try {
            const userToken = await this.userTokenModel.findOne({ userId })
            return userToken
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }
}
