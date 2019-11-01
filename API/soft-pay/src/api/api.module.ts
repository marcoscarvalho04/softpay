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
import { TransferService } from './services/transfer.service';
import { TransferController } from './controllers/transfer.controller';
import {Transfer} from './entities/transfer.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Merchant,Bank,PaymentOrder,Transfer])],
  providers: [MerchantService,BankService, PaymentOrderService,TransferService],
  controllers: [MerchantController,BankController, PaymentController,TransferController]
  
})
export class ApiModule {}
