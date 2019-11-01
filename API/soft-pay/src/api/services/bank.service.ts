import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Bank } from '../entities/bank.entity'



@Injectable()
export class BankService   {

  constructor(@InjectRepository(Bank)
    private readonly repository: Repository<Bank>
    
  ) {}

  async findById(id): Promise<Bank> {
    return await this.repository.findOne({ id })
  }

  async create(bank: Bank): Promise<Bank> {
    return await this.repository.save(bank);
  }

  async update(bank: Bank)  {
    let id = bank.id; 
    delete bank.id
    return await this.repository.update({id: id}, bank);
  }

  async delete(id){
    return await this.repository.delete(id);
  }
  
  async findByBankType(bankType) {
    return await this.repository.findOne({bankType: bankType})
  }

}
