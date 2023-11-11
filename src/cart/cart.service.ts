import { Injectable } from '@nestjs/common';
import { NotFoundExceptionCustom } from 'src/exceptions/NotFoundExceptionCustom.exception';
import { Model, MongooseError, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './schema/cart.schema';
import { CreateCartDto } from './dto/cart-create.dto';
import { InternalServerErrorExceptionCustom } from 'src/exceptions/InternalServerErrorExceptionCustom.exception';
import { ProductBillDto } from 'src/bill/dto/product-bill.dto';
import { Product } from 'src/product/schema/product.schema';
import { ConflictExceptionCustom } from 'src/exceptions/ConflictExceptionCustom.exception';

@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart.name)
        private readonly cartModel: Model<Cart>
    ) { }

    getTotalPrice(listProducts: ProductBillDto[]): number {
        const totalPrice = listProducts.reduce((total: number, product: ProductBillDto) => {
            const productTotal = product.quantity * product.price;
            return total + productTotal;
        }, 0)
        return totalPrice
    }

    async create(userId: string, product: Product): Promise<Cart> {
        try {
            const cart = new CreateCartDto()
            cart.userId = userId
            cart.storeId = product.storeId
            cart.storeName = product.storeName
            const productInfo = new ProductBillDto()
            productInfo.avatar = product.avatar
            productInfo.productId = product._id
            productInfo.productName = product.productName
            productInfo.quantity = product.quantity
            productInfo.price = product.price
            productInfo.type = product.type
            cart.listProducts = [productInfo]
            cart.totalPrice = this.getTotalPrice(cart.listProducts)

            const newCart = await this.cartModel.create(cart)
            return newCart
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async getAllByUserId(userId: string): Promise<Cart[]> {
        try {
            const carts = await this.cartModel.find({ userId })
            return carts
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async update(product: Product, cart: Cart): Promise<Cart> {
        try {
            const productInfo = new ProductBillDto()
            productInfo.avatar = product.avatar
            productInfo.productId = product._id
            productInfo.productName = product.productName
            productInfo.quantity = product.quantity
            productInfo.price = product.price
            productInfo.type = product.type
            cart.listProducts.push(productInfo)
            cart.totalPrice = this.getTotalPrice(cart.listProducts)
            await cart.save()
            return cart
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async addProductIntoCart(userId: string, product: Product): Promise<Cart> {
        const allCart = await this.getAllByUserId(userId)
        if (!allCart) {
            const newCart = await this.create(userId, product)
            return newCart
        }
        else {
            const cart = allCart.find(cart => cart.storeId.toString() === product.storeId.toString())
            if (!cart) {
                const newCart = await this.create(userId, product)
                return newCart
            }
            else {
                const hasProduct = cart.listProducts.find(productCart => productCart.productId.toString() === product._id.toString())
                if(hasProduct) { throw new ConflictExceptionCustom(Product.name) }
                const updatedCart = await this.update(product, cart)
                return updatedCart
            }
        }
    }

    async getByUserId(userId: string, pageQuery: number, limitQuery: number, searchQuery: string)
        : Promise<{ total: number, carts: Cart[] }> {
        const limit = Number(limitQuery) || Number(process.env.LIMIT_DEFAULT)
        const page = Number(pageQuery) || Number(process.env.PAGE_DEFAULT)
        const search = searchQuery
            ? {
                $or: [
                    { storeName: { $regex: searchQuery, $options: "i" } },
                    { listProducts: { $elemMatch: { productName: { $regex: searchQuery, $options: "i" } } } }
                ]
            }
            : {}
        const skip = limit * (page - 1)
        try {
            const total = await this.cartModel.countDocuments({ ...search, userId })
            const carts = await this.cartModel.find({ ...search, userId }).limit(limit).skip(skip)
            return { total, carts }
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }
}
