import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';
import { OrderDTO } from './order.dto';
import { InventoryService } from '../inventory/inventory.service';

/**
 * Order Service
 */
@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(OrderEntity) private orderRepository: Repository<OrderEntity>,
        private inventoryService: InventoryService) {}

    /**
     * Add order item
     * @param data Object
     */
    async add(data: OrderDTO) {
        // extract req data
        const { name, customer_email, quantity } = data

        // get inventory info for the specified item
        const inventoryItem = await this.inventoryService.getOneByName(name)

        // destructure invetory item data
        const { inventory_id, quantity_available, price} = inventoryItem

        // check if there is enough inventory to make order
        if (quantity_available <= 0 || quantity > quantity_available) {
            throw new Error('Cannot add item to order, insufficient quantities!')
        }

        // new order object
        const newOrder = {
            status: 'created',
            quantity_available,
            customer_email,
            amount: quantity * price,
            name,
            quantity,
        }

        // create new order
        const createdOrder = await this.orderRepository.create(newOrder)

        // if the order was succesfully created, update inventory
        if (createdOrder) {
            const updatedInventoryItemQuantity = quantity_available - quantity

            // update inventory
            await this.inventoryService.edit(inventory_id, {
                quantity_available: updatedInventoryItemQuantity,
            })
        }

        // save created order changes to database
        await this.orderRepository.save(createdOrder)
        return createdOrder
    }

    /**
     * Update order item
     * @param order_id String
     * @param data Object
     */
    async edit(order_id: string, data: Partial<OrderDTO>) {
        // extract req data
        const { name, customer_email, amount } = data

        // get inventory info for the specified item
        const inventoryItem = await this.inventoryService.getOneByName(name)

        // destructure invetory item data
        const { inventory_id, quantity_available} = inventoryItem

        // check if there is enough inventory to make order
        if (quantity_available <= 0 || amount > quantity_available) {
            throw new Error('Cannot add item to order, insufficient quantities!')
        }

        const updatedInventoryItemQuantity = quantity_available - amount
        const updatedInventoryItem = await this.inventoryService.edit(inventory_id, {
            quantity_available: updatedInventoryItemQuantity,
        })

        // save created order changes to database
        await this.orderRepository.update({order_id}, data)
        return await this.orderRepository.findOne({order_id})
    }

    /**
     * Delete order item
     * @param order_id String
     */
    async delete(order_id: string) {
        await this.orderRepository.delete({order_id})
        return {deleted: true}
    }

    /**
     * Return specific n item specified by order_id
     * @param order_id String
     */
    async getOne(order_id: string) {
        return await this.orderRepository.findOne({ where: { order_id } })
    }

    /**
     * Return all order items
     */
    async getAll() {
        return await this.orderRepository.find();
    }
}
