import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, Connection, Double } from 'typeorm';


@Entity('paymentorder')
export class PaymentOrder {
  
  @PrimaryGeneratedColumn()
  id: number;  

  @Column({nullable: false})
  bankId: number

  @Column({nullable: false})
  merchantId: number;

  @Column("decimal" , {precision: 5, scale: 2})
  value: number 

  @Column({ nullable: false })
  createDate: Date 

  @Column({ nullable: false })
  validDate: Date

  @Column({ nullable: false, default: 'PENDING_REGISTRATION'})
  paymentStatus: string

  @Column({ nullable: false, default: 'PENDING_REGISTRATION'})
  registrationStatus: string

  @Column({ nullable: true })
  paymentOrderDescription: string;

  @Column({nullable: false})
  paymentFullOrderNumber: string

  @Column({nullable: true})
  errorRegistration: string

  
}
