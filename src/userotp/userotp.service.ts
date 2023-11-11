import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError, Types } from 'mongoose';
import { Userotp } from './schema/userotp.schema';
import { InternalServerErrorExceptionCustom } from 'src/exceptions/InternalServerErrorExceptionCustom.exception';

@Injectable()
export class UserotpService {

    constructor(private mailService: MailerService,
        @InjectModel(Userotp.name)
        private userotpModel: Model<Userotp>
    ) { }
    async sendotp(email: string) {
        try {
            const otp = Math.floor(100000 + Math.random() * 900000).toString()
            await this.mailService.sendMail({
                to: email,
                from: process.env.MAIL_USER,
                subject: 'OTP',
                //Template is handlebar files
                template: './otp',
                context: {
                    otp
                }
            })

            return otp
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }
    async create(email: string, otp: string): Promise<Userotp> {
        try {
            const userotp = await this.userotpModel.create({ email, otp })
            return userotp
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async update(email: string, otp: string): Promise<Boolean> {
        try {
            const userotp = await this.userotpModel.updateOne({ email }, { otp });
            return userotp.modifiedCount > 0
        } catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async findUserotpByEmail(email: string): Promise<any> {
        try {
            const userotp = await this.userotpModel.findOne({ email });
            return userotp
        } catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async checkotp(otp: Number, email: string): Promise<boolean> {
        try {
            const userotp = await this.userotpModel.findOne({ email });
            if (userotp.otp == otp) {
                return true
            }
            return false
        } catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async deleteotp(email: string): Promise<any> {
        try {
            return await this.userotpModel.findOneAndDelete({ email });
        } catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }
}
