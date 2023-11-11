import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import * as firebase from 'firebase-admin';
import { FirebaseService } from 'src/firebase/firebase.service';
import { RoleName } from 'src/role/schema/role.schema';

@Injectable()
export class JwtATAuthGuard implements CanActivate {
    private auth: firebase.auth.Auth;
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        private reflector: Reflector,
        private firebaseApp: FirebaseService,
    ) {
        this.auth = firebaseApp.getAuth();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride('isPublic', [
            context.getHandler(),
            context.getClass()
        ])
        if (isPublic) { return true }
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            return false
        }
        try {
            const payLoadFirebaseAuth = await this.auth.verifyIdToken(token.replace('Bearer ', ''))
            if (payLoadFirebaseAuth.email) {
                request['user'] = {
                    userId: payLoadFirebaseAuth.uid,
                    role: RoleName.USER,
                    iat: payLoadFirebaseAuth.iat,
                    exp: payLoadFirebaseAuth.exp,
                };
            }
        } catch {
            try {
                const payload = await this.jwtService.verifyAsync(
                    token,
                    {
                        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
                    }
                );
                await this.userService.getById(payload.userId)
                request['user'] = payload;
            }
            catch {
                return false
            }
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}