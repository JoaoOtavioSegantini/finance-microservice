import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Account } from 'src/account/entities/account.entity';
import { TenantService } from './tenant/tenant.service';

@Module({
  imports: [SequelizeModule.forFeature([Account])],
  providers: [TenantService],
  exports: [TenantService],
})
export class TenantModule {}
