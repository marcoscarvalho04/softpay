import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Bank } from './bank.entity';

@Entity('merchant')
export class Merchant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: false, unique : true})
  cnpj: number;

  @Column({nullable: false, unique: true})
  socialName: string;

  @Column({ nullable: false })
  openingDate: string;

  @Column({ nullable: false })
  fantasyName: string;

  @Column({ nullable: false })
  address: string;

  @Column({ nullable: true })
  addressComplement: string;

  @Column({ nullable: false })
  addressCity: string;

  @Column({ nullable: false })
  addressUF: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false, default: 0 })
  cash: string;

  @OneToMany(type => Bank, bank => bank.merchant)
  bank: Bank[]

 
}
