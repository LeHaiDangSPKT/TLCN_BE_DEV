import { HttpStatus, Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { Policy } from './schema/policy.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { MongooseError } from 'mongoose';
import { InternalServerErrorExceptionCustom } from 'src/exceptions/InternalServerErrorExceptionCustom.exception';

@Injectable()
export class PolicyService {
    constructor(
        @InjectModel(Policy.name)
        private readonly policyModel: mongoose.Model<Policy>
    ) { }
    async create(createPolicyDto: CreatePolicyDto): Promise<Policy> {
        try {
            return await this.policyModel.create(createPolicyDto)
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async findAll(): Promise<Policy[]> {
        try {
            return await this.policyModel.find({})
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async update(id: string, updateFineDto: CreatePolicyDto): Promise<Policy> {
        try {
            return await this.policyModel.findByIdAndUpdate(id, updateFineDto)
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async remove(id: string): Promise<Policy> {
        try {
            return await this.policyModel.findByIdAndDelete(id)
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }
}
