import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, JoinColumn, RelationId } from 'typeorm'
import { OrderEntity } from '../order/order.entity'
/**
 * Inventory Entity
 */
@Entity('orders_items')
export class OrderItemEntity {
    @PrimaryGeneratedColumn('uuid') order_item_id: string
    @CreateDateColumn() created_date: Date
    @Column('integer') quantity: number
    @Column({type: 'integer', nullable: true}) previous_quantity: number
    @ManyToOne(type => OrderEntity, order => order.order_items)
    @JoinColumn({ name: 'order_id' })
    order: OrderEntity[];
    @Column('text') public orderId: string;
}
