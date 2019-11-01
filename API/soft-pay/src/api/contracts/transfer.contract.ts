import { Contract } from './contract'
import { Injectable, Inject } from '@nestjs/common'
import { Jarvis } from '../utils/jarvis'
import { TransferDTO } from '../controllers/DTO/transferDTO'




@Injectable()
export class TransferContract implements Contract {

  errors: any[]

  validate(model: TransferDTO): boolean {
    
    const jarvis = new Jarvis()
    this.errors = jarvis.errors
    jarvis.isRequired(model.merchantDestinationId, 'ID do estabelecimento destino é obrigatório')
    jarvis.isRequired(model.merchantOriginId, 'ID do estabelecimento origem é requerido')
    jarvis.isRequired(model.value, 'Valor da transferência é requerido')
    if(model.value < 0) {
        jarvis.errors.push('Valor de transferência deve ser maior do que 0')
    }
    return jarvis.isValid()
  }

}