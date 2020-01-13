import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {Promise} from 'bluebird';
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
        const inventoryItems = []
        let quantityOfAllItemsRequested = 0;
        let priceOfAllItemsRequested = 0;
        // extract req data
        const { inventories, customer_email } = data

        // loop through all inventory items and put them into an array
        await Promise.each(inventories, async item => {
            const { name, quantity } = item

            // get inventory info for the specified item
            const inventoryItem = await this.inventoryService.getOneByName(name)

            // check if there is enough inventory to make order
            if (inventoryItem.quantity_available <= 0 || quantity > inventoryItem.quantity_available) {
                throw new Error(`Cannot add ${name} to order, insufficient quantities!`)
            }

            // add item to array
            if (inventoryItem) {
                inventoryItems.push(inventoryItem)
            }
            const amountForOneItem = inventoryItem.price * inventoryItem.quantity

            priceOfAllItemsRequested += amountForOneItem
            quantityOfAllItemsRequested += quantity
        })

        // new order object
        const newOrder = {
            status: 'created',
            customer_email,
            amount: priceOfAllItemsRequested,
            quantity: quantityOfAllItemsRequested,
            inventories: inventoryItems,
        }

        // create new order
        const createdOrder = await this.orderRepository.create(newOrder)

        // if the order was succesfully created, update inventory
        if (createdOrder) {
            // loop through each item and update the inventory entity
            await Promise.each(createdOrder.inventories, async updatedItem => {
                await Promise.each(inventories, async originalItem => {

                    // calculate new quantity available
                    const updatedInventoryItemQuantity = updatedItem.quantity_available - originalItem.quantity

                    // update inventory
                    await this.inventoryService.edit(updatedItem.inventory_id, {
                        quantity_available: updatedInventoryItemQuantity,
                    })
                })

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
        // // extract req data
        // const { name, quantity } = data

        // // get original order
        // const originalOrder = await this.getOne(order_id);

        // // get inventory info for the specified item
        // const inventoryItem = await this.inventoryService.getOneByName(name)

        // // destructure invetory item data
        // const { inventory_id, quantity_available, price} = inventoryItem

        // // check if there is enough inventory to make order
        // if (quantity_available <= 0 || quantity > quantity_available) {
        //     throw new Error('Cannot update this order, insufficient quantities!')
        // }

        // // updated order object
        // const updatedOrder = {
        //     quantity,
        //     amount: quantity * price,
        //     status: 'updated',
        // }

        // save created order changes to database
        await this.orderRepository.update({order_id}, {})

        // // update inventory
        // const updatedInventoryItemQuantity = (quantity_available + originalOrder.quantity) - quantity
        // await this.inventoryService.edit(inventory_id, {
        //     quantity_available: updatedInventoryItemQuantity,
        // })

        return await this.orderRepository.findOne({order_id})
    }

    /**
     * Delete order item
     * @param order_id String
     */
    async delete(order_id: string, data: Partial<OrderDTO>) {
        // // get original order
        // const originalOrder = await this.getOne(order_id);

        // // extract req data
        // const { quantity } = originalOrder

        // // get inventory info for the specified item
        // const inventoryItem = await this.inventoryService.getOneByName(name)

        // // destructure invetory item data
        // const { inventory_id, quantity_available } = inventoryItem

        // delete order
        await this.orderRepository.delete({order_id})

        // // update inventory
        // const updatedInventoryItemQuantity = quantity_available + quantity
        // await this.inventoryService.edit(inventory_id, {
        //     quantity_available: updatedInventoryItemQuantity,
        // })

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
