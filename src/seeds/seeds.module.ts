import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { DataSeed } from './data.seed';
import { UserModule } from 'src/user/user.module';
import { RoleModule } from 'src/role/role.module';

@Module({
    imports: [
        CommandModule,
        UserModule,
        RoleModule,
    ],
    providers: [DataSeed],
    exports: [DataSeed],
})
export class SeedsModule {}