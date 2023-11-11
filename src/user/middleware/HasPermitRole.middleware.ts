import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response, NextFunction } from 'express';
import { Model, MongooseError, Types } from 'mongoose';
import { User } from '../schema/user.schema';
import { Role, RoleName } from 'src/role/schema/role.schema';
import { RoleService } from 'src/role/role.service';
import { InternalServerErrorExceptionCustom } from 'src/exceptions/InternalServerErrorExceptionCustom.exception';
import { BadRequestException } from 'src/core/error.response';

@Injectable()
export class HasPermitRoleMiddleware implements NestMiddleware {
    constructor(private readonly roleService: RoleService) { }
    async use(req: Request, res: Response, next: NextFunction) {
        if (req.params.id) {
            try {
                const id = req.params.id
                const roles = await this.roleService.getRoleNameByUserId(id)
                if (!roles) { return new BadRequestException("Bạn không có quyền thực hiện hành động này!") }
                if (roles.includes(RoleName.ADMIN) || roles.includes(RoleName.MANAGER)) {
                    return new BadRequestException("Bạn không có quyền thực hiện hành động này!")
                }
            }
            catch (err) {
                if (err instanceof MongooseError)
                    throw new InternalServerErrorExceptionCustom()
                throw err
            }
        }
        next();
    }
}
