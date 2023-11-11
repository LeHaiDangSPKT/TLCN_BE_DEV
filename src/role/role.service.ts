import { ConflictException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleName } from './schema/role.schema';
import { Model, MongooseError, ObjectId, Types } from 'mongoose';
import { CreateRoleDto } from './dto/create-role.dto';
import { NotFoundExceptionCustom } from 'src/exceptions/NotFoundExceptionCustom.exception';
import { ConflictExceptionCustom } from 'src/exceptions/ConflictExceptionCustom.exception';
import { InternalServerErrorExceptionCustom } from 'src/exceptions/InternalServerErrorExceptionCustom.exception';
import { UnauthorizedExceptionCustom } from 'src/exceptions/UnauthorizedExceptionCustom.exception';

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
            if (!role) { throw new NotFoundExceptionCustom(Role.name) }
            // check user
            const roleNames = await this.getRoleNameByUserId(userId)
            // has no role
            if(!roleNames) { return await this.addUserIntoListUser(role._id, userId) }
            // has role User and roleName input is Seller
            if(roleNames.includes(RoleName.USER) && roleName.name == RoleName.SELLER) { 
                return await this.addUserIntoListUser(role._id, userId) 
            }
            // throw error if user has role name Admin, Manager, Seller
            else{ throw new ConflictExceptionCustom(Role.name) }
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
            if (!result) { throw new NotFoundExceptionCustom(Role.name) }
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
            // check user is in listUser of any role, listUde is array of userId
            const role = await this.roleModel.findOne({ name, listUser: userId })
            if (!role) { throw new NotFoundExceptionCustom(Role.name) }
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
            if (!role) { throw new UnauthorizedExceptionCustom() }
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
