import { Injectable, HttpException, HttpStatus, Param } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Merchant } from '../entities/merchant.entity'
import { GenericService } from '../services/generic.service'
import { PaymentOrder} from '../entities/paymentOrder.entity'
import { Bank} from '../entities/bank.entity'




@Injectable()
export class PaymentOrderService {

  constructor(@InjectRepository(PaymentOrder)
    private readonly repository: Repository<PaymentOrder>,
    @InjectRepository(Merchant)
    private readonly merchantRepository: Repository<Merchant>,
    @InjectRepository(Bank)
    private readonly bankRepository: Repository<Bank>
  ) {}

  async findById(@Param() id){
      return await this.repository.findOne(id)
  }

  

  async savePaymentOrder(paymentOrder: PaymentOrder){
      return await this.repository.save(paymentOrder);
  }

  async updatePaymentOrder(paymentOrder: PaymentOrder){
      let id = paymentOrder.id; 
      delete paymentOrder.id
      return await this.repository.update({id: id}, paymentOrder)
  }

  async findByMerchantId(id): Promise<Merchant> {
    return await this.merchantRepository.findOne({id: id})
  }

  async findSystemBank(){
    return await this.bankRepository.findOne({bankType: 'SYSTEM_TYPE'})
  }

  async save(paymentOrder: PaymentOrder){
    return await this.repository.save(paymentOrder);
  }
}
