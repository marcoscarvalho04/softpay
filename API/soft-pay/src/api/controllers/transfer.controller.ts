import { Controller, Get, Post, Delete,Param, Body, HttpStatus, UseInterceptors,HttpException, BadRequestException, NotFoundException, InternalServerErrorException, Res } from '@nestjs/common';
import { ValidatorInterceptor } from '../interceptors/validate.interceptor'
import { Result } from '../utils/result';
import {TransferService} from '../services/transfer.service'
import { TransferContract } from '../contracts/transfer.contract';
import { TransferDTO } from './DTO/transferDTO';
import { Not } from 'typeorm';
import { Transfer } from '../entities/transfer.entity';


@Controller('v1/transfer')
export class TransferController {
  constructor(private readonly service: TransferService) {}

  @Post('')
  @UseInterceptors(new ValidatorInterceptor(new TransferContract))
  async transfer(@Body() body: TransferDTO){
    let originMerchant = await this.service.findByMerchantId(body.merchantOriginId);
    let destinationMerchant = await this.service.findByMerchantId(body.merchantDestinationId);
    if(originMerchant == undefined) {
        throw new NotFoundException('ID do estabelecimento origem não existe!');
    }else if(destinationMerchant == undefined) {
        throw new NotFoundException('ID do estabelecimento destino não existe!');
    }else {
         if((parseFloat(originMerchant.cash.toString()) - parseFloat(body.value.toString())) < 0){
                throw new BadRequestException('Estabelecimento de origem não tem fundos para a transação')
        }else {
                    originMerchant.cash = (parseFloat(originMerchant.cash.toString()) - parseFloat(body.value.toString()));
                    destinationMerchant.cash = parseFloat(destinationMerchant.cash.toString()) 
                    + parseFloat(body.value.toString()); 
                    this.service.updateMerchant(originMerchant);
                    this.service.updateMerchant(destinationMerchant);
                    // Save transfer into database. 
                    let saveTransfer = new Transfer();
                    saveTransfer.value = body.value;
                    saveTransfer.description = body.description;
                    saveTransfer.merchantDestinationId = body.merchantDestinationId;
                    saveTransfer.merchantOriginId = body.merchantOriginId
                    saveTransfer.transferDate = new Date()
                    this.service.save(saveTransfer);
                    return saveTransfer; 

            }
            
        
    }
  }

  

}

 
