import { SetMetadata } from "@nestjs/common";
export const CHECK_ROLE = 'check_role';
export const CheckRole = (...roles: string[]) => SetMetadata(CHECK_ROLE, roles)

