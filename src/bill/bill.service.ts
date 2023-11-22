import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Bill } from './schema/bill.schema';
import { Model, Error as MongooseError } from 'mongoose';
import { CartInfo, GiveInfo, ProductInfo, ReceiverInfo } from './dto/create-bill.dto';
import { ProductBillDto } from './dto/product-bill.dto';
import { InternalServerErrorExceptionCustom } from 'src/exceptions/InternalServerErrorExceptionCustom.exception';

@Injectable()
export class BillService {
    constructor(
        @InjectModel(Bill.name)
        private readonly billModel: Model<Bill>
    ) { }

    getTotalPrice(listProducts: ProductBillDto[], promotionValue: number): number {
        const productPrice = listProducts.reduce((total: number, product: ProductBillDto) => {
            const productTotal = product.quantity * product.price;
            return total + productTotal;
        }, 0)
        const totalPrice = productPrice - promotionValue
        return totalPrice
    }

    async create(userId: string, billDto: CartInfo, deliveryMethod: string, paymentMethod: string,
        receiverInfo: ReceiverInfo, giveInfo: GiveInfo, deliveryFee: number): Promise<Bill> {
        try {
            const billData = await this.billModel.create(billDto)
            billData.userId = userId
            billData.deliveryMethod = deliveryMethod
            billData.paymentMethod = paymentMethod
            billData.receiverInfo = receiverInfo
            if (giveInfo) billData.giveInfo = giveInfo
            billData.deliveryFee = deliveryFee
            paymentMethod === 'CASH' ? billData.isPaid = false : billData.isPaid = true

            billData.save()
            return billData
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async countTotalByStatus(storeId: string, status: string, year: number): Promise<number> {
        try {
            const query: any = { storeId, status }

            if (year) {
                query.$expr = {
                    $eq: [
                        { $year: '$createdAt' },
                        { $year: new Date(year) }
                    ]
                }
            }

            const total = await this.billModel.countDocuments({ ...query })

            return total

        } catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom();
            throw err
        }
    }


    async calculateRevenueAllTime(storeId: string): Promise<number> {
        try {
            const result = await this.billModel.aggregate([
                {
                    $match: {
                        storeId: storeId.toString(),
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: '$totalPrice' },
                    },
                },
            ])

            const totalRevenue = result[0]?.totalRevenue || 0

            return totalRevenue

        } catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }


    async calculateRevenueByYear(storeId: string, year: number): Promise<Record<string, any>> {
        try {
            const result = await this.billModel.aggregate([
                {
                    $match: {
                        storeId: storeId.toString(),
                        $expr: {
                            $eq: [
                                { $year: '$createdAt' },
                                { $year: new Date(year) }
                            ]
                        }
                    },
                },
                {
                    $group: {
                        _id: { $month: '$createdAt' },
                        totalRevenue: { $sum: '$totalPrice' },
                    },
                },
            ])

            // Tạo mảng chứa 12 tháng với doanh thu mặc định là 0
            const monthlyRevenue: Record<number, number> = {
                1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0,
            }

            // Chỉ chứa những tháng có thông tin
            // const monthlyRevenue: Record<number, number> = {}

            let totalRevenue = 0
            let minRevenue: { month: number; revenue: number } | null = null
            let maxRevenue: { month: number; revenue: number } | null = null

            result.forEach((entry: { _id: number; totalRevenue: number }) => {
                const month = entry._id
                const revenue = entry.totalRevenue

                monthlyRevenue[month] = revenue
                totalRevenue += revenue

                if (!minRevenue || revenue < minRevenue.revenue) {
                    minRevenue = { month, revenue }
                }

                if (!maxRevenue || revenue > maxRevenue.revenue) {
                    maxRevenue = { month, revenue }
                }
            })

            const response = {
                data: monthlyRevenue,
                revenueTotalAllTime: await this.calculateRevenueAllTime(storeId),
                revenueTotalInYear: totalRevenue,
                minRevenue,
                maxRevenue,
            }

            return response

        } catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }


    async getAllByStatus(idCondition: any, pageQuery: number, limitQuery: number, searchQuery: string, statusQuery: string)
        : Promise<{ total: number, bills: Bill[] }> {
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
        const statusRegex = { status: { $regex: statusQuery, $options: "i" } }
        const skip = limit * (page - 1)
        try {
            const total = await this.billModel.countDocuments({ ...idCondition, ...statusRegex, ...search })
            const bills = await this.billModel.find({ ...idCondition, ...statusRegex, ...search }).limit(limit).skip(skip)
            return { total, bills }
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async getDetailById(id: string): Promise<Bill> {
        try {
            const bill = await this.billModel.findById(id)
            return bill
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async update(id: string, status: string): Promise<boolean> {
        try {
            const bill = await this.billModel.findByIdAndUpdate({ _id: id }, { status })
            return bill ? true : false
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async getStatistic(storeId: string, startTime: string, endTime: string, type: string): Promise<Bill[]> {
        if (type === 'doanh thu') return await this.getStatisticTotalPrice(storeId, startTime, endTime)
        return await this.getStatisticProductType(storeId, startTime, endTime, type)
    }


    async getStatisticProductType(storeId: string, startTime: string, endTime: string, type: string): Promise<Bill[]> {
        try {
            const search = { listProducts: { $elemMatch: { type: { $regex: type, $options: "i" } } } }
            const bills = await this.billModel.find({ storeId, createdAt: { $gte: startTime, $lte: endTime }, ...search, status: 'Đã đặt' })
            return bills
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async getStatisticTotalPrice(storeId: string, startTime: string, endTime: string): Promise<Bill[]> {
        try {
            const bills = await this.billModel.find({ storeId, createdAt: { $gte: startTime, $lte: endTime }, status: 'Đã đặt' })
            return bills
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }
}
