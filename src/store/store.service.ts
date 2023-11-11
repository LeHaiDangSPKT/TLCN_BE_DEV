import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Store } from './schema/store.schema';
import { Model, MongooseError, Types } from 'mongoose';
import { CreateStoreDto } from './dto/create-store.dto';
import { InternalServerErrorExceptionCustom } from 'src/exceptions/InternalServerErrorExceptionCustom.exception';
import { NotFoundExceptionCustom } from 'src/exceptions/NotFoundExceptionCustom.exception';
import { ConflictExceptionCustom } from 'src/exceptions/ConflictExceptionCustom.exception';
import { User } from 'src/user/schema/user.schema';

@Injectable()
export class StoreService {
    constructor(
        @InjectModel(Store.name)
        private readonly storeModel: Model<Store>
    ) { }

    async create(user: User, store: CreateStoreDto): Promise<Store> {
        try {
            const hasStore = await this.storeModel.findOne({ userId: user._id })
            if (hasStore) { throw new ConflictExceptionCustom(Store.name) }
            const newStore = await this.storeModel.create(store)
            newStore.userId = user._id
            newStore.phone = [user.phone]
            await newStore.save()
            return newStore
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async getById(id: string): Promise<Store> {
        try {
            const store = await this.storeModel.findById(id)
            if (!store) { throw new NotFoundExceptionCustom(Store.name) }
            return store
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async getByUserId(userId: string): Promise<Store> {
        try {
            const store = await this.storeModel.findOne({ userId })
            if (!store) { throw new NotFoundExceptionCustom(Store.name) }
            return store
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async update(userId: string, store: any): Promise<Store> {
        try {
            await this.getByUserId(userId)
            const updatedStore = await this.storeModel.findOneAndUpdate({ userId }, store, { new: true })
            return updatedStore
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async updateWarningCount(storeId: string, action: string): Promise<Store> {
        try {
            var point = 1;
            if (action === 'minus')
                point = -1
            const store = await this.storeModel.findByIdAndUpdate(storeId, { $inc: { warningCount: point } })
            if (!store) { throw new NotFoundExceptionCustom(Store.name) }
            return store
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async delete(userId: string): Promise<boolean> {
        try {
            const store = await this.storeModel.findOneAndDelete({ userId })
            if (!store) { throw new NotFoundExceptionCustom(Store.name) }
            return true
        } catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

}
