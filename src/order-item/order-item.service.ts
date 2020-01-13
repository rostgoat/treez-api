import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OrderItemEntity } from './order-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItemDTO } from './order-item.dto';

/**
 * Order item Service
 */
@Injectable()
export class OrderItemService {
    constructor(@InjectRepository(OrderItemEntity) private orderItemRepository: Repository<OrderItemEntity>) {}

    /**
     * Add order item
     * @param data Object
     */
    async add(data: OrderItemDTO) {
        const orderItem = await this.orderItemRepository.create(data)
        await this.orderItemRepository.save(orderItem)
        return orderItem
    }

    /**
     * Update order item
     * @param order_item_id String
     * @param data Object
     */
    async edit(order_item_id: string, data: Partial<OrderItemDTO>) {
        await this.orderItemRepository.update({order_item_id}, data)
        return await this.orderItemRepository.findOne({order_item_id})
    }

    /**
     * Delete order item
     * @param order_item_id String
     */
    async delete(order_item_id: string) {
        await this.orderItemRepository.delete({order_item_id})
        return {deleted: true}
    }

    /**
     * Return specific order item specified by order_id
     * @param name String
     */
    async getOneByOrder(order_id: string) {
        return await this.orderItemRepository.findOne({ where: { order_id } })
    }

    /**
     * Return all order items
     */
    async getAll() {
        return await this.orderItemRepository.find();
    }

    /**
     * Return all order items
     */
    async getAllByOrder(orderId: string) {
        return await this.orderItemRepository.find({ where: { orderId } })
    }
}
