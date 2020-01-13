import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne } from 'typeorm'
import { OrderEntity } from '../order/order.entity'
/**
 * Inventory Entity
 */
@Entity('inventory')
@Unique(['name'])
export class InventoryEntity {
    @PrimaryGeneratedColumn('uuid') inventory_id: string
    @Column('text') name: string
    @Column('text') description: string
    @Column('float4') price: number
    @Column('integer') quantity_available: number
    @Column('integer') quantity: number
    @ManyToOne(type => OrderEntity, order => order.inventories) order: OrderEntity;

}
