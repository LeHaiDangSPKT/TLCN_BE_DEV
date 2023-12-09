import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Model, MongooseError } from 'mongoose';
import { Category } from './schema/category.schema';
import { InternalServerErrorExceptionCustom } from 'src/exceptions/InternalServerErrorExceptionCustom.exception';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>
  ) { }
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      return await this.categoryModel.create(createCategoryDto)
    }
    catch (err) {
      if (err instanceof MongooseError)
        throw new InternalServerErrorExceptionCustom()
      throw err
    }
  }

  async findAllByCategoryName(id: string, status: string): Promise<Category[]> {
    try {
      //Nếu có id thì lấy theo id, còn không thì lấy tất cả, nếu có status thì lấy theo status, còn không thì lấy tất cả
      const query = id ? { _id: id } : {}
      if (status) {
        query['status'] = Boolean(status);
      }
      return await this.categoryModel.find(query).exec()
    }
    catch (err) {
      if (err instanceof MongooseError)
        throw new InternalServerErrorExceptionCustom()
      throw err
    }
  }

  async getById(id: string): Promise<Category> {
    try {
      return await this.categoryModel.findById(id)
    }
    catch (err) {
      if (err instanceof MongooseError)
        throw new InternalServerErrorExceptionCustom()
      throw err
    }
  }
}
