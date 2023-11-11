import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { PolicyService } from './policy.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AbilitiesGuard } from 'src/ability/guards/abilities.guard';
import { CheckAbilities, CreatePolicyAbility, DeletePolicyAbility, ReadPolicyAbility, UpdatePolicyAbility } from 'src/ability/decorators/abilities.decorator';
import { CheckRole } from 'src/ability/decorators/role.decorator';
import { RoleName } from 'src/role/schema/role.schema';
import { SuccessResponse } from 'src/core/success.response';
import { NotFoundException } from 'src/core/error.response';

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
    async create(@Body() createPolicyDto: CreatePolicyDto): Promise<SuccessResponse> {
        const data = await this.policyService.create(createPolicyDto);
        return new SuccessResponse({
            message: "Tạo chính sách thành công!",
            metadata: { data },
        })
    }

    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new ReadPolicyAbility())
    @CheckRole(RoleName.ADMIN)
    @Get("admin")
    async findAll(): Promise<SuccessResponse> {
        const data = await this.policyService.findAll();
        return new SuccessResponse({
            message: "Lấy danh sách chính sách thành công!",
            metadata: { data },
        })
    }
    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new UpdatePolicyAbility())
    @CheckRole(RoleName.ADMIN)
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateFineDto: CreatePolicyDto): Promise<SuccessResponse | NotFoundException> {
        const data = await this.policyService.update(id, updateFineDto);
        if (!data) return new NotFoundException("Không tìm thấy chính sách này!")
        return new SuccessResponse({
            message: "Cập nhật chính sách thành công!",
            metadata: { data },
        })
    }
    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new DeletePolicyAbility())
    @CheckRole(RoleName.ADMIN)
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<SuccessResponse | NotFoundException> {
        const data = await this.policyService.remove(id);
        if (!data) return new NotFoundException("Không tìm thấy chính sách này!")
        return new SuccessResponse({
            message: "Xóa chính sách thành công!",
            metadata: { data },
        })
    }

}
