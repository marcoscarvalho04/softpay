import { Contract } from './contract'
import { Injectable, Inject } from '@nestjs/common'
import { Jarvis } from '../utils/jarvis'
import {Bank} from '../entities/bank.entity'
import { isNullOrUndefined } from 'util'

@Injectable()
export class BankContract implements Contract {
    errors: any[]
    
    validate(model: Bank): boolean {
    
    const jarvis = new Jarvis()
    if(!isNullOrUndefined(model))  {
        jarvis.isNotNull(model.merchant,'ID do estabelecimento é obrigatório')
        jarvis.isNotNull(model.merchant.id,'ID do estabelecimento é obrigatório')
        jarvis.isRequired(model.bankNumber, 'Número da conta é requerido'); 
        jarvis.isRequired(model.bankCode,'Código do banco é obrigatório')
        jarvis.isRequired(model.bankAgency, 'Agência do banco é obrigatória')
        jarvis.isRequired(model.bankAgencyValidationCode,'Código de validação do número da conta é obrigatório')
        if(model.bankType != undefined && model.bankType == 'SYSTEM_TYPE') {
            jarvis.isRequired(model.bankWallet, 'Carteira é requerida quando o banco é para geração de boleto')
        }
    } else {
        this.errors.push('Corpo da requisição é obrigatório')
    }
    
    this.errors = jarvis.errors

    return jarvis.isValid()
  }

}