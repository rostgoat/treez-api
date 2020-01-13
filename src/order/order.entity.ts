import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm'
import { InventoryEntity } from '../inventory/inventory.entity'
import { OrderItemEntity } from '../order-item/order-item.entity'
/**
 * Inventory Entity
 */
@Entity('orders')
export class OrderEntity {
    @PrimaryGeneratedColumn('uuid') order_id: string
    @Column('text') customer_email: string
    @CreateDateColumn() created_date: Date
    @Column('text') status: string
    @Column('decimal') amount: number
    @Column('integer') quantity: number
    @Column({type: 'integer', nullable: true}) previous_quantity: number
    @OneToMany(type => InventoryEntity, inventory => inventory.inventoryOrder) inventories: InventoryEntity[];
    @OneToMany(type => OrderItemEntity, order_item => order_item.order) order_items: OrderItemEntity[];
}
