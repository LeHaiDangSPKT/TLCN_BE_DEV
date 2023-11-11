import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response, NextFunction } from 'express';
import { Model, MongooseError, Types } from 'mongoose';
import { NotFoundExceptionCustom } from 'src/exceptions/NotFoundExceptionCustom.exception';
import { User } from '../schema/user.schema';
import { Role, RoleName } from 'src/role/schema/role.schema';
import { RoleService } from 'src/role/role.service';
import { InternalServerErrorExceptionCustom } from 'src/exceptions/InternalServerErrorExceptionCustom.exception';

@Injectable()
export class HasSameRoleUserMiddleware implements NestMiddleware {
    constructor(private readonly roleService: RoleService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        if (req.params.id) {
            try {
                const id1 = req.params.id
                const id2 = req.body.id

                const roles1 = await this.roleService.getRoleNameByUserId(id1)
                const roles2 = await this.roleService.getRoleNameByUserId(id2)

                if (!roles1 || !roles2) { throw new NotFoundExceptionCustom(Role.name) }
                if (roles1.includes(RoleName.USER) || roles2.includes( RoleName.USER)) {
                    throw new NotFoundExceptionCustom(User.name)
                }
            }
            catch (err) {
                if (err instanceof MongooseError)
                    throw new InternalServerErrorExceptionCustom()
                throw err
            }
        }
        console.log("Pass HasSameRoleUserMiddleware")
        next();
    }
}
