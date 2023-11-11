import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { PolicyService } from './policy.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { Policy } from './schema/policy.schema';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AbilitiesGuard } from 'src/ability/guards/abilities.guard';
import { CheckAbilities, CreatePolicyAbility, DeletePolicyAbility, ReadPolicyAbility, UpdatePolicyAbility } from 'src/ability/decorators/abilities.decorator';
import { CheckRole } from 'src/ability/decorators/role.decorator';
import { RoleName } from 'src/role/schema/role.schema';

@Controller('policy')
@ApiTags('Policy')
@ApiBearerAuth('Authorization')
export class PolicyController {
    constructor(
        private policyService: PolicyService,
    ) { }

    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new CreatePolicyAbility())
    @CheckRole(RoleName.ADMIN)
    @Post("admin")
    create(@Body() createPolicyDto: CreatePolicyDto): Promise<Policy> {
        return this.policyService.create(createPolicyDto);
    }

    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new ReadPolicyAbility())
    @CheckRole(RoleName.ADMIN)
    @Get("admin")
    findAll(): Promise<Policy[]> {
        return this.policyService.findAll();
    }
    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new UpdatePolicyAbility())
    @CheckRole(RoleName.ADMIN)
    @Put(':id')
    update(@Param('id') id: string, @Body() updateFineDto: CreatePolicyDto): Promise<Policy> {
        return this.policyService.update(id, updateFineDto);
    }
    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new DeletePolicyAbility())
    @CheckRole(RoleName.ADMIN)
    @Delete(':id')
    remove(@Param('id') id: string): Promise<Policy> {
        return this.policyService.remove(id);
    }

}
