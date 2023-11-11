import { Injectable } from '@nestjs/common';
import { CreateFineDto } from './dto/create-fine.dto';
import { Fine } from './schema/fine.shema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError } from 'mongoose';
import { InternalServerErrorExceptionCustom } from 'src/exceptions/InternalServerErrorExceptionCustom.exception';

@Injectable()
export class FineService {
  constructor(
    @InjectModel(Fine.name)
    private readonly fineModel: Model<Fine>
  ) { }
  async create(createFineDto: CreateFineDto): Promise<Fine> {
    try {
      return await this.fineModel.create(createFineDto)
    }
    catch (err) {
      if (err instanceof MongooseError)
        throw new InternalServerErrorExceptionCustom()
      throw err
    }
  }

  async findAll(): Promise<Fine[]> {
    try {
      return await this.fineModel.find({})
    }
    catch (err) {
      if (err instanceof MongooseError)
        throw new InternalServerErrorExceptionCustom()
      throw err
    }
  }

  async update(id: string, updateFineDto: CreateFineDto): Promise<Fine> {
    try {
      return await this.fineModel.findByIdAndUpdate(id, updateFineDto)
    }
    catch (err) {
      if (err instanceof MongooseError)
        throw new InternalServerErrorExceptionCustom()
      throw err
    }
  }

  async remove(id: string): Promise<Fine> {
    try {
      return await this.fineModel.findByIdAndDelete(id)
    }
    catch (err) {
      if (err instanceof MongooseError)
        throw new InternalServerErrorExceptionCustom()
      throw err
    }
  }
}
