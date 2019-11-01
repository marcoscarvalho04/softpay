import { Contract } from './contract'
import { Injectable, Inject } from '@nestjs/common'
import { Merchant } from '../entities/merchant.entity'
import { Jarvis } from '../utils/jarvis'




@Injectable()


export class LoginContract implements Contract {

  errors: any[]
  
  
 
  validate(model: Merchant): boolean {
    
    const jarvis = new Jarvis()

    
    if((model.cnpj == undefined || model.cnpj.length == 0)
     && (model.email == undefined || model.email.length == 0 ) ){
        jarvis.errors.push('Email ou CNPJ devem ser presentes.')
    }
    if((model.password == undefined|| model.password.length == 0)){
      jarvis.errors.push('Password é requerido.');
    }
    if(model.cnpj != undefined && model.cnpj.length != 0 ){ 
        jarvis.isFixedLen(model.cnpj,14,'CNPJ deve ter tamanho de 14 se presente')
    }else {
        jarvis.isEmail(model.email, 'Deve ser email');
    }
 
    this.errors = jarvis.errors

    return jarvis.isValid()
  }

}