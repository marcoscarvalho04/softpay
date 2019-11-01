import { Injectable, HttpException, HttpStatus, Param } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Merchant } from '../entities/merchant.entity'
import { GenericService } from '../services/generic.service'
import { PaymentOrder} from '../entities/paymentOrder.entity'



@Injectable()
export class PaymentService {

  constructor(@InjectRepository(PaymentOrder)
    private readonly repository: Repository<PaymentOrder>
    
  ) {}

  async getPaymentOrder(@Param() id){
      return await this.repository.findOne(id)
  }

  async savePaymentOrder(paymentOrder: PaymentOrder){
      return await this.repository.save(paymentOrder);
  }

  async updatePaymentOrder(paymentOrder: PaymentOrder){
      return await this.repository.update(paymentOrder.id, paymentOrder)
  }
}
