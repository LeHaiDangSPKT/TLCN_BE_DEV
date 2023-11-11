import { Body, Controller, Param, Post, Delete, Get, UseGuards, Request, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Role, RoleName } from './schema/role.schema';
import { CheckAbilities, CreateRoleAbility, ReadRoleAbility, UpdateRoleAbility } from 'src/ability/decorators/abilities.decorator';
import { AbilitiesGuard } from 'src/ability/guards/abilities.guard';
import { CheckRole } from 'src/ability/decorators/role.decorator';

@Controller('role/admin')
@ApiTags('Role')
@ApiBearerAuth('Authorization')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateRoleAbility())
  @CheckRole(RoleName.ADMIN)
  @Post('addUserToRole')
  @ApiQuery({ name: 'userId', type: String, required: true })
  async addUserToRole(
    @Query('userId') userId: string,
    @Body() roleName: CreateRoleDto
  ): Promise<boolean> {
    const result = await this.roleService.addUserToRole(userId, roleName)
    return result
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateRoleAbility())
  @CheckRole(RoleName.ADMIN)
  @Delete('removeUserRole')
  @ApiQuery({ name: 'userId', type: String, required: true })
  @ApiQuery({ name: 'roleName', type: String, required: true })
  async removeUserRole(
    @Query('userId') userId: string,
    @Query('roleName') roleName: string,
  ): Promise<boolean> {
    const result = await this.roleService.removeUserRole(userId, roleName)
    return result
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadRoleAbility())
  @CheckRole(RoleName.ADMIN, RoleName.MANAGER)
  @Get('getRoleNameByUserId')
  @ApiQuery({ name: 'userId', type: String, required: true })
  async getRoleNameByUserId(
    @Query('userId') userId: string,
  ): Promise<string> {
    const role = await this.roleService.getRoleNameByUserId(userId)
    return role
  }

}
