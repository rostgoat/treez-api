import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm'
import { InventoryEntity } from '../inventory/inventory.entity'
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
    @Column({type: 'integer', nullable: true}) previous_quantity: number
    @OneToMany(type => InventoryEntity, inventory => inventory.order) inventories: InventoryEntity[];
}
