import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
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
     this.repository.update(merchant.id, merchant);
     return merchant;
  }

  async authenticate(merchant: Merchant): Promise<Merchant> {
    
    if(merchant.cnpj != undefined && merchant.cnpj.length == 14){
      return this.repository.findOne({cnpj: merchant.cnpj});
    } else {
      return this.repository.findOne({email: merchant.email});
    }  
    
    
  }

  async findByCnpj(cnpj) {
    return await this.repository.findOne({cnpj: cnpj})
  }
  async findByEmail(email){ 
    return await this.repository.findOne({email: email});
  }

}
