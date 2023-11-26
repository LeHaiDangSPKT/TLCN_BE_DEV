import { ConflictException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleName } from './schema/role.schema';
import { Model, MongooseError, ObjectId, Types } from 'mongoose';
import { CreateRoleDto } from './dto/create-role.dto';
import { InternalServerErrorExceptionCustom } from 'src/exceptions/InternalServerErrorExceptionCustom.exception';

@Injectable()
export class RoleService {
    constructor(
        @InjectModel(Role.name)
        private readonly roleModel: Model<Role>
    ) { }

    async create(role: CreateRoleDto): Promise<Role> {
        try {
            const newRole = await this.roleModel.create(role)
            return newRole
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async addUserToRole(userId: string, roleName: CreateRoleDto): Promise<boolean> {
        try {
            // check role is exist
            const role = await this.getByName(roleName.name)
            if (!role) { return false }
            // check user
            const roleNames = await this.getRoleNameByUserId(userId)
            // has no role
            if(!roleNames) { return await this.addUserIntoListUser(role._id, userId) }
            // has role User and roleName input is Seller
            if(roleNames.includes(RoleName.USER) && roleName.name == RoleName.SELLER) { 
                return await this.addUserIntoListUser(role._id, userId) 
            }
            // throw error if user has role name Admin, Manager, Seller
            else{ return false }
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async getByName(roleName: string): Promise<Role> {
        try {
            const role = await this.roleModel.findOne({ name: roleName })
            return role
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async addUserIntoListUser(roleId: string, userId: string): Promise<boolean> {
        try {
            const result = await this.roleModel.findByIdAndUpdate(roleId, { $push: { listUser: userId } })
            if (!result) { return false }
            return true
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async removeUserRole(userId: string, name: string): Promise<boolean> {
        try {
            // check user is in listUser of any role, listUser is array of userId
            const role = await this.roleModel.findOne({ name, listUser: userId })
            if (!role) { return false }
            // remove user from listUser of role
            const result = await this.roleModel.findByIdAndUpdate(role._id, { $pull: { listUser: userId } })
            if (!result) return false
            return true
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }

    }

    async getRoleNameByUserId(userId: string): Promise<string> {
        try {
            const role = await this.roleModel.find({ listUser: userId })
            if (!role) { return "" }
            const roleName = role.map(role => role.name).join(' - ')
            return roleName
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async getByUserId(userId: string): Promise<any> {
        try {
            const role = await this.roleModel.findOne({ listUser: userId })
            return role
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

}
