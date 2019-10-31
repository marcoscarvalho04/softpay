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

    
    jarvis.isRequired(model.cnpj, 'O CNPJ é obrigatório.')
    jarvis.isRequired(model.socialName, 'Razão social é obrigatoria')
    jarvis.isRequired(model.openingDate, 'Data de abertura é obrigatoria') 
    jarvis.isRequired(model.fantasyName, 'Nome fantasia é obrigatorio') 
    jarvis.isRequired(model.address, 'Endereço é obrigatorio')
    jarvis.isRequired(model.addressCity, 'Cidade é obrigatoria')
    jarvis.isRequired(model.addressUF, 'UF da cidade é obrigatoria') 
    jarvis.isFixedLen(model.addressUF,2,'UF deve ter apenas dois caracteres')
    jarvis.isRequired(model.email, 'Email é obrigatório')
    jarvis.isEmail(model.email,'Email não está formatado corretamente')
    jarvis.isRequired(model.password,'Senha é requerida')
    jarvis.hasMinLen(model.fantasyName, 1, 'O nome Fantasia é obrigatório')

 
    this.errors = jarvis.errors

    return jarvis.isValid()
  }

}