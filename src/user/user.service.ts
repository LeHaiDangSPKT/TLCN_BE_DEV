import { Injectable, NotFoundException } from '@nestjs/common';
import { SignUpDto } from 'src/auth/dto/signup.dto';
import { User } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError, Types } from 'mongoose';
import { UserWithoutPassDto } from './dto/user-without-pass.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InternalServerErrorExceptionCustom } from 'src/exceptions/InternalServerErrorExceptionCustom.exception';


@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>
  ) { }

  async create(signUpDto: SignUpDto): Promise<UserWithoutPassDto> {
    try {
      const newUser = await this.userModel.create(signUpDto)
      await newUser.save()
      const userDoc = newUser['_doc']
      const { password, ...userWithoutPass } = userDoc
      return userWithoutPass
    }
    catch (err) {
      if (err instanceof MongooseError)
        throw new InternalServerErrorExceptionCustom()
      throw err
    }

  }

  async getByEmail(email: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ email })

      user.address.sort((a, b) => (b.default ? 1 : -1) - (a.default ? 1 : -1))
      
      return user

    }
    catch (err) {
      if (err instanceof MongooseError)
        throw new InternalServerErrorExceptionCustom()
      throw err
    }
  }

  async getById(userId: string): Promise<User> {
    try {
      const user = await this.userModel.findById(userId)

      user.address.sort((a, b) => (b.default ? 1 : -1) - (a.default ? 1 : -1))

      return user

    }
    catch (err) {
      if (err instanceof MongooseError)
        throw new InternalServerErrorExceptionCustom()
      throw err
    }
  }


  async update(userId: string, req: any): Promise<User> {
    try {

      const user = await this.userModel.findByIdAndUpdate(userId, req, { new: true })

      return user

    } catch (err) {
      if (err instanceof MongooseError)
        throw new InternalServerErrorExceptionCustom()
      throw err
    }
  }

  async delete(userId: string): Promise<User> {
    try {
      const user = await this.userModel.findByIdAndDelete(userId)
      return user
    } catch (err) {
      if (err instanceof MongooseError)
        throw new InternalServerErrorExceptionCustom()
      throw err
    }
  }

  async addFriend(userId: string, friendId: string): Promise<User | boolean> {
    try {
      // Get friends 
      const user = await this.userModel.findById(userId)
      if (!user) { return false }
      const friends = user.friends
      if (friends.includes(friendId.toString())) { return false }
      friends.push(friendId.toString())
      user.friends = friends
      await user.save()
      return user
    } catch (err) {
      if (err instanceof MongooseError)
        throw new InternalServerErrorExceptionCustom()
      throw err
    }
  }

  async unFriend(userId: string, friendId: string): Promise<User | boolean> {
    try {
      // Get friends 
      const user = await this.userModel.findById(userId)
      if (!user) { return false }
      const friends = user.friends
      if (!friends.includes(friendId.toString())) { return false }
      const index = friends.indexOf(friendId.toString())
      friends.splice(index, 1)
      user.friends = friends
      await user.save()
      return user
    } catch (err) {
      if (err instanceof MongooseError)
        throw new InternalServerErrorExceptionCustom()
      throw err
    }
  }

  async followStore(userId: string, storeId: string): Promise<User | boolean> {
    try {
      // Get friends 
      const user = await this.userModel.findById(userId)
      if (!user) { return false }
      const stores = user.followStores
      if (stores.includes(storeId.toString())) { return false }
      stores.push(storeId.toString())
      user.followStores = stores
      await user.save()
      return user
    } catch (err) {
      if (err instanceof MongooseError)
        throw new InternalServerErrorExceptionCustom()
      throw err
    }
  }

  async unFollowStore(userId: string, storeId: string): Promise<User | boolean> {
    try {
      // Get friends 
      const user = await this.userModel.findById(userId)
      if (!user) { return false }
      const stores = user.followStores
      if (!stores.includes(storeId.toString())) { return false }
      const index = stores.indexOf(storeId.toString())
      stores.splice(index, 1)
      user.followStores = stores
      await user.save()
      return user
    } catch (err) {
      if (err instanceof MongooseError)
        throw new InternalServerErrorExceptionCustom()
      throw err
    }
  }


  async updateWallet(userId: string, money: number, type: string): Promise<boolean> {
    try {
      const user = await this.getById(userId)
      const bonus = (money * 0.2) / 1000
      const updateUser = new UpdateUserDto()
      updateUser.wallet = type == "plus" ? (user.wallet + bonus) : (user.wallet - bonus)
      await this.update(userId, updateUser)
      return true
    } catch (err) {
      if (err instanceof MongooseError)
        throw new InternalServerErrorExceptionCustom()
      throw err
    }
  }

  async updateWarningCount(userId: string, action: string): Promise<User> {
    try {
      var point = 1;
      if (action === 'minus')
        point = -1
      const user = await this.userModel.findByIdAndUpdate(userId, { $inc: { warningCount: point } })
      return user
    } catch (err) {
      if (err instanceof MongooseError)
        throw new InternalServerErrorExceptionCustom()
      throw err
    }
  }
  // getAll
  async getAll(page: number, limit: number, search: string): Promise<{ total: number, users: User[] }> {
    try {
      // Total user and search user by email or name
      const total = await this.userModel.countDocuments({ $or: [{ email: { $regex: search, $options: 'i' } }, { name: { $regex: search, $options: 'i' } }] })
      const users = await this.userModel.find({ $or: [{ email: { $regex: search, $options: 'i' } }, { name: { $regex: search, $options: 'i' } }] })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)

      users.map(user => {
        user.address.sort((a, b) => (b.default ? 1 : -1) - (a.default ? 1 : -1))
        return user
      })

      return { total, users }

    } catch (err) {
      if (err instanceof MongooseError)
        throw new InternalServerErrorExceptionCustom()
      throw err
    }
  }

  async updatePassword(email: string, password: string): Promise<User> {
    try {
      // Update password by email
      return await this.userModel.findOneAndUpdate({ email }, { password })
    } catch (err) {
      if (err instanceof MongooseError)
        throw new InternalServerErrorExceptionCustom()
      throw err
    }
  }

}