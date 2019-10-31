import { Controller, Get, Post, Param, Body, HttpStatus, UseInterceptors,HttpException } from '@nestjs/common';
import { ValidatorInterceptor } from '../interceptors/validate.interceptor'
import { MerchantContract } from "../contracts/merchant.contract"
import { BankService } from '../services/bank.service';
import {Bank} from '../entities/bank.entity'
import { BankContract } from '../contracts/bank.contract';
import { Connection } from 'typeorm';

@Controller('v1/banks')
export class BankController {
  constructor(private readonly service: BankService) {}

  @Get(':id')
  async findById(@Param('id') id) {
    try {
      return await this.service.findById(id);
    } catch (error) {
      return HttpStatus.BAD_REQUEST;
    }
  }

  @Post('')
  @UseInterceptors(new ValidatorInterceptor(new BankContract))
  async authenticate(@Body() body: Bank) {
    return await this.service.create(body);
  }

  
}
