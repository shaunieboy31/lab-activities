import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  customerName: string

  @Column()
  customerEmail: string

  @Column()
  customerPhone: string

  @Column('simple-json')
  items: { productId: number; name: string; price: number; quantity: number }[]

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number

  @Column({ default: 'pending' })
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'

  @Column({ default: 'gcash' })
  paymentMethod: string

  @Column({ nullable: true })
  qrCodeData: string

  @CreateDateColumn()
  createdAt: Date
}
