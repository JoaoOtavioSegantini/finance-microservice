import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountService {
  constructor(@InjectModel(Account) private accountModel: typeof Account) {}

  create(createAccountDto: CreateAccountDto) {
    return this.accountModel.create(createAccountDto as any);
  }

  findAll() {
    return this.accountModel.findAll();
  }

  findOne(id: string) {
    return this.accountModel.findByPk(id, {
      rejectOnEmpty: true,
    });
  }
}
