import { Injectable, HttpException, HttpStatus, Param } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Transfer } from '../entities/transfer.entity';
import { Merchant } from '../entities/merchant.entity'
import { TransferDTO } from '../controllers/DTO/transferDTO';



@Injectable()
export class TransferService {

  constructor(@InjectRepository(Transfer)
    private readonly repository: Repository<Transfer>,
    @InjectRepository(Merchant)
    private readonly merchantRepository: Repository<Merchant>
    
  ) {}

  async transfer(transferDTO: TransferDTO) {

  }

  async findByMerchantId(id): Promise<Merchant> {
      return await this.merchantRepository.findOne({id:id});
  }

  async updateMerchant(model: Merchant){
      let id = model.id; 
      delete model.id; 
      return await this.merchantRepository.update(id, model)
  }

  async save(transfer: Transfer) {
    return await this.repository.save(transfer);
  }
  
}
