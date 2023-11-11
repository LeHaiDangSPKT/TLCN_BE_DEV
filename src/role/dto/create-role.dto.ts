import { ApiProperty } from "@nestjs/swagger";
import { RoleName } from "../schema/role.schema";

export class CreateRoleDto {
    @ApiProperty()
    name: RoleName;
}