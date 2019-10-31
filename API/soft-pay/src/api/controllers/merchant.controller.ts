import { Controller, Get, Post, Param, Body, HttpStatus, UseInterceptors,HttpException } from '@nestjs/common';
import { MerchantService } from '../services/merchant.service';
import { Merchant } from '../entities/merchant.entity'
import { ValidatorInterceptor } from '../interceptors/validate.interceptor'
import { MerchantContract } from "../contracts/merchant.contract"

@Controller('v1/merchants')
export class MerchantController {
  constructor(private readonly service: MerchantService) {}

  @Get(':id')
  async findById(@Param('id') id) {
    try {
      return await this.service.findById(id);
    } catch (error) {
      return HttpStatus.BAD_REQUEST;
    }
  }

  @Post('')
  @UseInterceptors(new ValidatorInterceptor(new MerchantContract))
  async authenticate(@Body() body: Merchant) {
    return await this.service.create(body);
  }
}
