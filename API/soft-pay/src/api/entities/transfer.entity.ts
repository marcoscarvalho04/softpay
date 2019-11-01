import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


@Entity('transfer')
export class Transfer {
  
  @PrimaryGeneratedColumn()
  id: number;  

  @Column({nullable: false})
  merchantOriginId: number

  @Column({nullable: false})
  merchantDestinationId: number;

  @Column("decimal" , {precision: 5, scale: 2})
  value: number 

  @Column({ nullable: false })
  transferDate: Date 

  @Column({ nullable: false })
  description: string

  

  
}
