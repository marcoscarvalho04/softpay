import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, Connection } from 'typeorm';
import {Merchant} from '../entities/merchant.entity'

@Entity('bank')
export class Bank {
  @PrimaryGeneratedColumn()
  id: number;  

  @ManyToOne(type => Merchant, merchant => merchant.bank,{cascade:true})
  merchant: Merchant

  @Column({nullable: false})
  bankNumber: number;

  @Column({ nullable: false })
  bankCode: number;

  @Column({ nullable: false })
  bankAgency: number;

  @Column({ nullable: false })
  bankAgencyValidationCode: string;

  @Column({ nullable: false , default: 'MERCHANT_TYPE'})
  bankType: string;

  @Column({ nullable: false, default: 'ACTIVE'})
  bankStatus: string;

  @Column({ nullable: true })
  bankWallet: number;

  
}
