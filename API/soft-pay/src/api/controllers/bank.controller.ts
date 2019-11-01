import { Controller, Get, Post, Param,Delete, Body, HttpStatus, UseInterceptors,HttpException } from '@nestjs/common';
import { ValidatorInterceptor } from '../interceptors/validate.interceptor'
import { BankService } from '../services/bank.service';
import {Bank} from '../entities/bank.entity'
import { BankContract } from '../contracts/bank.contract';
import { Result} from '../utils/result'


@Controller('v1/banks')
export class BankController {
  constructor(private readonly service: BankService) {}

  @Get(':id')
  async findById(@Param('id') id) {
    try {
      let result = await this.service.findById(id);
      if(result == undefined ){
        return new Result('Banco não existe!', false, null,  HttpStatus.NOT_FOUND);
      }
      return result
    } catch (error) {
      return new Result('Erro ao tentar pesquisar o banco', false, null,  HttpStatus.INTERNAL_SERVER_ERROR);
    }
  
  }
  @Post('')
  @UseInterceptors(new ValidatorInterceptor(new BankContract))
  async create(@Body() body: Bank){
    if(body.bankType == 'SYSTEM_TYPE') {
      let resultBankType =  await this.service.findByBankType(body.bankType)
      if(resultBankType != undefined) {
        return new Result('Já existe um banco do tipo SYSTEM_TYPE. Antes de inserir um novo, remove o antigo',false,null,HttpStatus.BAD_REQUEST);
      }
    }
    let result = this.service.create(body)
    if(result == undefined) {
      return new Result('Erro ao cadastrar o banco!', false, null,  HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @Post('/update')
  @UseInterceptors(new ValidatorInterceptor(new BankContract)) 
  async update(@Body() body: Bank) {
    let result = await this.service.findById(body.id);
    if(result == undefined) {
      return new Result("Banco não existe para atualizacao",false,null,HttpStatus.BAD_REQUEST)
    } else {
      this.service.update(body).catch(() => {
        new Result("Erro ao atualizar o banco",false,null,HttpStatus.BAD_REQUEST);
      });
    }
    
    return body; 
  }

  @Delete(':id')
  async delete(@Param('id') id){
    let result = await this.service.findById(id); 
    if(result == undefined) {
      return new Result('Banco não existe para ser deletado!',false,null,HttpStatus.NOT_FOUND);
    } else {
      return await this.service.delete(id);
    }
    
  }





  
}
