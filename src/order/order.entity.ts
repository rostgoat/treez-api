import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

/**
 * Inventory Entity
 */
@Entity('order')
export class OrderEntity {
    @PrimaryGeneratedColumn('uuid') order_id: string
    @Column('text') customer_email: string
    @CreateDateColumn() created_date: Date
    @Column('text') status: string
    @Column('decimal') amount: number
    @Column('integer') quantity: number
}
