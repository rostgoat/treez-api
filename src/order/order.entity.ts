import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, Index } from 'typeorm'

/**
 * Inventory Entity
 */
@Entity('order')
export class OrderEntity {
    @PrimaryGeneratedColumn('uuid') order_id: string
    @Column('text') customer_email: string
    @CreateDateColumn() created_date: Date
    @Column('text') status: string
    @Column('float4') amount: number
}
