import { Injectable } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { Promotion } from './schema/promotion.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError } from 'mongoose';
import { InternalServerErrorExceptionCustom } from 'src/exceptions/InternalServerErrorExceptionCustom.exception';

@Injectable()
export class PromotionService {
  constructor(
    @InjectModel(Promotion.name)
    private readonly promotionModel: Model<Promotion>
  ) { }
  async create(createPromotionDto: CreatePromotionDto): Promise<Promotion> {
    try {
      return await this.promotionModel.create(createPromotionDto)
    }
    catch (err) {
      if (err instanceof MongooseError)
        throw new InternalServerErrorExceptionCustom()
      throw err
    }
  }

  async findAllByProductType(productType: string): Promise<Promotion[]> {
    try {
      return await this.promotionModel.find({ productType })
    }
    catch (err) {
      if (err instanceof MongooseError)
        throw new InternalServerErrorExceptionCustom()
      throw err
    }
  }

  async update(id: string, updatePromotionDto: CreatePromotionDto): Promise<Promotion> {
    try {
      return await this.promotionModel.findByIdAndUpdate(id, updatePromotionDto)
    }
    catch (err) {
      if (err instanceof MongooseError)
        throw new InternalServerErrorExceptionCustom()
      throw err
    }
  }

  async remove(id: string): Promise<Promotion> {
    try {
      return await this.promotionModel.findByIdAndDelete(id)
    }
    catch (err) {
      if (err instanceof MongooseError)
        throw new InternalServerErrorExceptionCustom()
      throw err
    }
  }
}
