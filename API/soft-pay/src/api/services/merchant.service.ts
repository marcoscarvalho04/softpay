import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Merchant } from '../entities/merchant.entity'
import { GenericService } from '../services/generic.service'



@Injectable()
export class MerchantService implements GenericService  {

  constructor(@InjectRepository(Merchant)
    private readonly repository: Repository<Merchant>
    
  ) {}

  async findById(id): Promise<Merchant> {
    return await this.repository.findOne({ id })
  }

  async existsByCNPJ(value): Promise<Merchant> {
    return await this.repository.findOne({cnpj: value}); 
  }

  async create(merchant: Merchant) {
    return await this.repository.save(merchant)
  }

  async deleteById(id){
    return await this.repository.delete({id: id})
  }

  async update(merchant: Merchant) {
    return await this.repository.update(merchant.id, merchant);
  }

}
