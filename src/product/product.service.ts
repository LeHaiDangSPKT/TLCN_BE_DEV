import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schema/product.schema';
import { Model, MongooseError, Types } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { InternalServerErrorExceptionCustom } from 'src/exceptions/InternalServerErrorExceptionCustom.exception';
import { NotFoundExceptionCustom } from 'src/exceptions/NotFoundExceptionCustom.exception';
import { Store } from 'src/store/schema/store.schema';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name)
        private readonly productModel: Model<Product>
    ) { }

    async create(store: Store, product: CreateProductDto): Promise<Product> {
        try {
            const newProduct = await this.productModel.create(product)
            newProduct.storeId = store._id
            newProduct.storeName = store.storeName
            await newProduct.save()
            return newProduct
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async getById(id: string): Promise<Product> {
        try {
            const product = await this.productModel.findById(id)
            if (!product) { throw new NotFoundExceptionCustom(Product.name) }
            return product
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async getAllBySearch(storeIdInput: string, pageQuery: number, limitQuery: number, searchQuery: string)
        : Promise<{ total: number, products: Product[] }> {
        const storeId = storeIdInput ? { storeId: storeIdInput } : {}
        const limit = Number(limitQuery) || Number(process.env.LIMIT_DEFAULT)
        const page = Number(pageQuery) || Number(process.env.PAGE_DEFAULT)
        const search = searchQuery
            ? {
                $or: [
                    { productName: { $regex: searchQuery, $options: "i" } },
                    { category: { $regex: searchQuery, $options: "i" } },
                    { keywords: { $regex: searchQuery, $options: "i" } }
                ]
            }
            : {}
        const skip = limit * (page - 1)
        try {
            const total = await this.productModel.countDocuments({ ...search, ...storeId })
            const products = await this.productModel.find({ ...search, ...storeId }).limit(limit).skip(skip)
            return { total, products }
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async update(id: string, product: any): Promise<Product> {
        try {
            product = { status: false }
            await this.getById(id)
            const updatedProduct = await this.productModel.findByIdAndUpdate({ _id: id }, product, { new: true })
            return updatedProduct
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async deleteProduct(productId: string): Promise<Product> {
        try {
            const product = await this.productModel.findOneAndDelete({ _id: productId })
            return product
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async getlistProductLasted(limit: number): Promise<Product[]> {
        try {
            const products = await this.productModel.find({}).sort({ createdAt: -1 }).limit(limit)
            return products
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async mostProductsInStore(limit: number): Promise<Product[]> {
        try {
            const products = await this.productModel.aggregate([
                {
                    $group: {
                        _id: '$storeId',
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { count: -1 }
                },
                {
                    $limit: Number(limit)
                }
            ])
            const storeIds = products.map(product => product._id)
            var arr = []
            for (let i = 0; i < storeIds.length; i++) {
                const product = await this.productModel.find({ storeId: storeIds[i] }, { _id: 1, avatar: 1, quantity: 1, productName: 1, price: 1, storeName: 1, storeId: 1, type: 1 }).limit(10)
                arr.push(product)
            }
            return arr
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }


}
