import { Controller, Get, Post, Param,Delete, Body, HttpStatus, UseInterceptors,HttpException, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ValidatorInterceptor } from '../interceptors/validate.interceptor'
import { BankService } from '../services/bank.service';
import {Bank} from '../entities/bank.entity'
import { BankContract } from '../contracts/bank.contract';



@Controller('v1/banks')
export class BankController {
  constructor(private readonly service: BankService) {}

  @Get(':id')
  async findById(@Param('id') id) {
    let result = await this.service.findById(id);
    if(result == undefined ){
        throw new NotFoundException('Banco não existe no cadastro!')
    }else {
        return result
    }
 }
  @Post('')
  @UseInterceptors(new ValidatorInterceptor(new BankContract))
  async create(@Body() body: Bank){
    if(body.bankType == 'SYSTEM_TYPE') {
      let resultBankType =  await this.service.findByBankType(body.bankType)
      if(resultBankType != undefined) {
         throw new BadRequestException('Já existe um banco do tipo SYSTEM_TYPE. Antes de inserir um novo, remove o antigo');
      } else {
        return await this.service.create(body)
      }
    }else {
      return await this.service.create(body)
    }
    
  }

  @Post('/update')
  @UseInterceptors(new ValidatorInterceptor(new BankContract)) 
  async update(@Body() body: Bank) {
    let result = await this.service.findById(body.id);
    if(result == undefined) {
      throw new NotFoundException('Banco não existe para atualização!');
    } else {
      this.service.update(body).catch(() => {
        throw new InternalServerErrorException('Erro ao tentar atualizar o banco!s')
      });
    }
    
    return body; 
  }

  @Delete(':id')
  async delete(@Param('id') id){
    let result = await this.service.findById(id); 
    if(result == undefined) {
      throw new NotFoundException('Banco não existe para atualização')
    } else {
      return await this.service.delete(id);
    }
    
  }





  
}
