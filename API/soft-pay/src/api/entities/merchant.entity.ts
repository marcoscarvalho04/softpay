import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';


@Entity('merchant')
export class Merchant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: false, unique : true})
  cnpj: string;

  @Column({nullable: true})
  socialName: string;

  @Column({ nullable: true })
  openingDate: string;

  @Column({ nullable: true })
  fantasyName: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  addressComplement: string;

  @Column({ nullable: true })
  addressCity: string;

  @Column({ nullable: true })
  addressUF: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false, default: 0 })
  cash: string;

  
 
}
