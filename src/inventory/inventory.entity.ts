import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, JoinColumn } from 'typeorm'
import { OrderEntity } from '../order/order.entity'
/**
 * Inventory Entity
 */
@Entity('inventories')
@Unique(['name'])
export class InventoryEntity {
    @PrimaryGeneratedColumn('uuid') inventory_id: string
    @Column('text') name: string
    @Column('text') description: string
    @Column('float4') price: number
    @Column('integer') quantity_available: number
    @ManyToOne(type => OrderEntity, order => order.inventories)
    @JoinColumn({ name: 'order_id' })
    order: OrderEntity;

}
