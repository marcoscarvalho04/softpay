import { Controller, Get, Post, Delete,Param, Body, HttpStatus, UseInterceptors,HttpException, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { MerchantService } from '../services/merchant.service';
import { Merchant } from '../entities/merchant.entity'
import { ValidatorInterceptor } from '../interceptors/validate.interceptor'
import { MerchantContract } from "../contracts/merchant.contract"
import { LoginContract } from '../contracts/login.contract'


@Controller('v1/merchants')
export class MerchantController {
  constructor(private readonly service: MerchantService) {}

  @Get(':id')
  async findById(@Param('id') id) {
    try { 
      let result =  await this.service.findById(id);
      if(result == undefined) { 
       // return new Result('Não encontrado!', false, null,  HttpStatus.BAD_REQUEST);
        throw new HttpException({
            status: HttpStatus.NOT_FOUND,
            error: HttpStatus.NOT_FOUND},
            HttpStatus.NOT_FOUND);
      } else {
        return result;
      }
       
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'NOT_FOUND'},
        HttpStatus.NOT_FOUND);;
    }
  }

  @Post('')
  @UseInterceptors(new ValidatorInterceptor(new MerchantContract))
  async authenticate(@Body() body: Merchant) {
    let result = await this.service.findByCnpj(body.cnpj);
    if(result != undefined){
      throw new HttpException('CNPJ já existe',HttpStatus.BAD_REQUEST);
    }
    let resultEmail = this.service.findByEmail(body.email);
    if(resultEmail != undefined) {
      throw new HttpException('Email já cadastrado!', HttpStatus.BAD_REQUEST);
    }else {
      return await this.service.create(body)
      //.catch(Merchant => {
        //return new Result('Erro ao cadastrar o estabelecimento', false, null,  HttpStatus.BAD_REQUEST);
        //throw new HttpException('Erro ao cadastrar o estabelecimento!', HttpStatus.INTERNAL_SERVER_ERROR);
      //});
    }
      
    
  }

  @Post('/update')
  @UseInterceptors(new ValidatorInterceptor(new MerchantContract))
  async update( @Body() body: Merchant){
    if(body.id == undefined) {
      throw new BadRequestException('ID deve ser informado para atualização');
    } else {
      let result = await this.service.findById(body.id);
    if(result == undefined){
      throw new NotFoundException('ID não existe para atualizacao');
    } else {
      let resultCnpj = await this.service.findByCnpj(body.cnpj);
      if(resultCnpj != undefined) {
        throw new BadRequestException('CNPJ para atualização já existe!');
      } else {
        let resultEmail = await this.service.findByEmail(body.email);
        if(resultEmail != undefined) {
          throw new BadRequestException('Email para atualização já existe!')
        } else {
          return await this.service.update(body).catch( () => {
            throw new InternalServerErrorException('Erro ao atualizar o estabelecimento!');
          })
        }
      }
      
    }
    }
    
    
  }

  @Delete('/delete/:id')
  async delete(@Param('id') id){
    return await this.service.deleteById(id);
  }

  @Get('/login/:login/:senha')
  @UseInterceptors(new ValidatorInterceptor(new LoginContract))
  async login(@Param('login') login, @Param('senha') senha ){
     let result = await this.service.authenticate(login)
     if(result == undefined) {
      throw new BadRequestException('Usuário ou senha inválidos')
    } else if(result.password != undefined && result.password != senha) {
      throw new BadRequestException('Usuário ou senha inválidos')
    } else {
      return'Login ok'
    }
  }
}
