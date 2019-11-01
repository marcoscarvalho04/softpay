import { Controller, Get, Post, Delete,Param, Body, HttpStatus, UseInterceptors,HttpException, BadRequestException, NotFoundException } from '@nestjs/common';
import { ValidatorInterceptor } from '../interceptors/validate.interceptor'
import { Result } from '../utils/result';

@Controller('v1/payment')
export class PaymentController {
  constructor(private readonly service: MerchantService) {}

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

  @Post('')
  @UseInterceptors(new ValidatorInterceptor(new MerchantContract))
  async authenticate(@Body() body: Merchant) {
      return await this.service.create(body).catch(() => {
        return new Result('Erro ao cadastrar o merchant', false, null,  HttpStatus.BAD_REQUEST);
      });
    
  }

  @Post('/update/')
  @UseInterceptors(new ValidatorInterceptor(new MerchantContract))
  async update( @Body() body: Merchant){
    return await this.service.update(body)
  }

  @Delete('/delete/:id')
  async delete(@Param('id') id){
    return await this.service.deleteById(id);
  }

  @Post('/login')
  @UseInterceptors(new ValidatorInterceptor(new LoginContract))
  async login(@Body() body){
     let result = await this.service.authenticate(body)
     if(result == undefined) {
      return new Result('Usuário ou senha invalidos!', false, null,  HttpStatus.BAD_REQUEST);
    } else if(result.password != undefined && result.password != body.password) {
      return new Result('Usuário ou senha invalidos!', false, null,  HttpStatus.BAD_REQUEST);
    } else {
      HttpStatus.OK;
    }
  }
}
