import { Controller, Get, Post, Delete,Param, Body, HttpStatus, UseInterceptors,HttpException, BadRequestException, NotFoundException, InternalServerErrorException, Res } from '@nestjs/common';
import { ValidatorInterceptor } from '../interceptors/validate.interceptor'
import { Result } from '../utils/result';
import { PaymentOrderService } from '../services/paymentorder.service';
import { PaymentOrderContract } from '../contracts/paymentorder.contract';
import { PaymentOrder } from '../entities/paymentOrder.entity';
import { PaymentOrderDTO } from './DTO/paymentorderDTO';

@Controller('v1/paymentorder')
export class PaymentController {
  constructor(private readonly service: PaymentOrderService) {}

  @Get(':id')
  async findById(@Param('id') id) {
    try { 
      let result =  await this.service.findById(id);
      if(result == undefined) { 
        return new Result('Não encontrado!', false, null,  HttpStatus.BAD_REQUEST);
      }
      return result; 
    } catch (error) {
      return  HttpStatus.BAD_REQUEST;
    }
  }

  @Post('/generate')
  @UseInterceptors(new ValidatorInterceptor(new PaymentOrderContract))
  async generatePaymentOrder(@Body() paymentOrderDTO: PaymentOrderDTO){
    let resultMerchantId = await this.service.findByMerchantId(paymentOrderDTO.merchantId); 
    if(resultMerchantId == undefined) {
      throw new NotFoundException('ID do estabelecimento não existe!')
    } else {
      let systemBank = await this.service.findSystemBank();
      if(systemBank == undefined) {
        throw new  InternalServerErrorException('Banco para geração do boleto indisponível!')
      } else {
        let fullNumber = '00000.00000 00000.000000.00000 000000 0 00000000000000';
        
        var today  = new Date();
        
        let savePaymentOrder = new PaymentOrder();
        savePaymentOrder.merchantId = paymentOrderDTO.merchantId
        savePaymentOrder.bankId = systemBank.id; 
        savePaymentOrder.paymentFullOrderNumber = fullNumber
        savePaymentOrder.createDate = today;
        today.setDate(today.getDate()+2)
        savePaymentOrder.validDate = (today);
        savePaymentOrder.paymentOrderDescription = paymentOrderDTO.description;
        savePaymentOrder.value = paymentOrderDTO.value;
        this.service.savePaymentOrder(savePaymentOrder);
        // supressed logic for paymentOrder generation. Only return mock and fixed paymentOrderFullNumber
        return new Result(fullNumber,true,null,null);
      }
    }
  }

}

 
