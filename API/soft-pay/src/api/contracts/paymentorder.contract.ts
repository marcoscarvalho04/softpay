import { Contract } from './contract'
import { Injectable, Inject } from '@nestjs/common'
import { Jarvis } from '../utils/jarvis'

import { PaymentOrderDTO } from '../controllers/DTO/paymentorderDTO'




@Injectable()
export class PaymentOrderContract implements Contract {

  errors: any[]

  validate(model: PaymentOrderDTO): boolean {
    
    const jarvis = new Jarvis()

    jarvis.isRequired(model.merchantId, 'ID do estabelecimento é obrigatório')
    jarvis.isRequired(model.value, 'Valor é obrigatório')
 
    this.errors = jarvis.errors

    return jarvis.isValid()
  }

}