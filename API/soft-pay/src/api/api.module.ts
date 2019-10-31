import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Merchant } from './entities/merchant.entity';
import { MerchantService } from './services/merchant.service';
import { MerchantController } from './controllers/merchant.controller';
import { BankService } from './services/bank.service';
import { BankController } from './controllers/bank.controller';
import { Bank } from './entities/bank.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Merchant,Bank])],
  providers: [MerchantService,BankService],
  controllers: [MerchantController,BankController]
  
})
export class ApiModule {}
