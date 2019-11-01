import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Merchant } from './entities/merchant.entity';
import { MerchantService } from './services/merchant.service';
import { MerchantController } from './controllers/merchant.controller';
import { BankService } from './services/bank.service';
import { BankController } from './controllers/bank.controller';
import { Bank } from './entities/bank.entity';
import { PaymentOrderService } from './services/paymentorder.service';
import {PaymentController} from './controllers/paymentorder.controller'
import { PaymentOrder } from './entities/paymentOrder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Merchant,Bank,PaymentOrder])],
  providers: [MerchantService,BankService, PaymentOrderService],
  controllers: [MerchantController,BankController, PaymentController]
  
})
export class ApiModule {}
