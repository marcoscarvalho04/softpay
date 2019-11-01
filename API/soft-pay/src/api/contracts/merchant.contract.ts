import { Contract } from './contract'
import { Injectable, Inject } from '@nestjs/common'
import { Merchant } from '../entities/merchant.entity'
import { Jarvis } from '../utils/jarvis'
import { MerchantService } from '../services/merchant.service'




@Injectable()


export class MerchantContract implements Contract {

  errors: any[]
  
  
  
 
  validate(model: Merchant): boolean {
    
    const jarvis = new Jarvis()

    
    jarvis.isFixedLen(model.cnpj,14, 'O CNPJ é obrigatório e tem tamanho de 14.')
    jarvis.isRequired(model.email, 'Email é obrigatório')
    jarvis.isEmail(model.email,'Email não está formatado corretamente')
    jarvis.isRequired(model.password,'Senha é requerida')
   
    this.errors = jarvis.errors

    return jarvis.isValid()
  }

}