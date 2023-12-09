import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schema/product.schema';
import { Model, MongooseError, Types } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { Store } from 'src/store/schema/store.schema';
import { InternalServerErrorExceptionCustom } from 'src/exceptions/InternalServerErrorExceptionCustom.exception';
import removeVietnameseTones from 'src/utils/removeVietNameseTones';
import sortByConditions from 'src/utils/sortByContitions';

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
            const product = await this.productModel.findOne({ _id: id, status: true })
            return product
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async getAllBySearch(storeIdInput: string, pageQuery: number, limitQuery: number, searchQuery: string, 
        sortTypeQuery: string = 'desc', sortValueQuery: string = 'productName', status: any)
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
            const total = await this.productModel.countDocuments({ ...search, ...storeId, ...status })
            const products = await this.productModel.find({ ...search, ...storeId, ...status })
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip(skip)

            sortByConditions(products, sortTypeQuery, sortValueQuery)

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
            const updatedProduct = await this.productModel.findByIdAndUpdate({ _id: id }, { ...product }, { new: true })
            if (product.quantity === 0) {
                updatedProduct.status = false
                await updatedProduct.save()
            }
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
            const product = await this.productModel.findByIdAndUpdate({ _id: productId, status: true }, { status: false }, { new: true })
            return product
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async getListProductLasted(limit: number): Promise<Product[]> {
        try {
            const products = await this.productModel.find({status: true}).sort({ createdAt: -1 }).limit(limit)
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
            const limitQuery = Number(limit) || Number(process.env.LIMIT_DEFAULT)
            const products = await this.productModel.aggregate([
                {
                    $match: { status: true }
                },
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
                    $limit: limitQuery
                }
            ])
            const storeIds = products.map(product => product._id)
            var arr = []
            for (let i = 0; i < storeIds.length; i++) {
                const product = await this.productModel.find({ storeId: storeIds[i] }).limit(10)
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

    async updateQuantity(id: string, quantitySold: number): Promise<void> {
        try {
            const product: Product = await this.getById(id)
            product.quantity -= quantitySold
            if (product.quantity === 0) {
                product.status = false
            }
            await product.save()
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }


    async getRandomProducts(limit: number = 3): Promise<Product[]> {
        try {
            const products = await this.productModel.aggregate([
                { $match: { status: true } },
                { $sample: { size: Number(limit) } }
            ])
            return products
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

}
