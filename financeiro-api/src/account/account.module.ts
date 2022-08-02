import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Account } from './entities/account.entity';
import { MyAccountController } from './my-account/my-account.controller';

@Module({
  imports: [SequelizeModule.forFeature([Account])],
  controllers: [AccountController, MyAccountController],
  providers: [AccountService],
})
export class AccountModule {}
