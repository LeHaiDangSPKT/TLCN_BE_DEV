import { Module } from '@nestjs/common';
import { AbilityFactory } from './ability.factory';
import { RoleModule } from 'src/role/role.module';
import { RoleService } from 'src/role/role.service';
import { AbilitiesGuard } from './guards/abilities.guard';
import { Role } from 'src/role/schema/role.schema';

@Module({
    providers: [AbilityFactory],
    exports: [AbilityFactory],
})
export class AbilityModule {}
