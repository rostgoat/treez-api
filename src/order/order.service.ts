import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Promise } from 'bluebird';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';
import { OrderDTO } from './order.dto';
import { InventoryService } from '../inventory/inventory.service';
import { OrderItemService } from '../order-item/order-item.service';

/**
 * Order Service
 */
@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(OrderEntity) private orderRepository: Repository<OrderEntity>,
        private inventoryService: InventoryService,
        private orderItemService: OrderItemService) {}

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
            const amountForOneItem = inventoryItem.price * quantity

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
        await this.orderRepository.save(createdOrder)
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

        await Promise.each(inventories, async item => {
            // create order item
            await this.orderItemService.add({
                quantity: item.quantity,
                previous_quantity: 0,
                orderId: createdOrder.order_id,
            })
        })

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
        const inventoryItems = []
        let updatedQuantityOfAllItemsRequested = 0;
        let updatedPriceOfAllItemsRequested = 0;

        // extract req data
        const { inventories, customer_email } = data

        // loop through all inventory items and put them into an array
        await Promise.each(inventories, async item => {
            const { name, quantity } = item

            // get inventory info for the specified item
            const inventoryItem = await this.inventoryService.getOneByName(name)

            // const updatedItemQuantity =
            // check if there is enough inventory to make order
            if (inventoryItem.quantity_available <= 0 || quantity > inventoryItem.quantity_available) {
                throw new Error(`Cannot update order, insufficient quantities of ${name}!`)
            }

            const amountForOneItem = inventoryItem.price * quantity

            updatedPriceOfAllItemsRequested += amountForOneItem
            updatedQuantityOfAllItemsRequested += quantity
        })

        // new order object
        const newOrder = {
            status: 'updated',
            customer_email,
            amount: updatedPriceOfAllItemsRequested,
            quantity: updatedQuantityOfAllItemsRequested,
        }

        // save order
        await this.orderRepository.save(newOrder)

        // save created order changes to database
        const updatedOrder = await this.orderRepository.update({order_id}, newOrder)

        // if the order was succesfully created, update inventory
        if (updatedOrder) {

            // loop through each item and update the inventory entity
            await Promise.each(inventories, async item => {
                const { name, quantity, previous_quantity } = item

                // get inventory info for the specified item
                const inventoryItem = await this.inventoryService.getOneByName(name)

                // calculate new quantity available
                const updatedInventoryItemQuantity = (inventoryItem.quantity_available + previous_quantity) - quantity

                // add item to array
                if (inventoryItem) {
                    inventoryItems.push(inventoryItem)
                }

                // update inventory
                await this.inventoryService.edit(inventoryItem.inventory_id, {
                    quantity_available: updatedInventoryItemQuantity,
                })

            })
        }
        return await this.orderRepository.findOne({order_id})
    }

    /**
     * Delete order item
     * @param order_id String
     */
    async delete(order_id: string) {
        // get related inventory items
        const inventories = await this.inventoryService.getAllByOrder()
        // get related order items
        const orderItems = await this.orderItemService.getAllByOrder(order_id)

        // loop through each item and update the available quantity
        await Promise.each(inventories, async inventoryItem => {
            await Promise.each(orderItems, async orderItem => {

                // re add quantity back to inventory
                const updatedInventoryItemQuantity = inventoryItem.quantity_available + orderItem.quantity

                // update inventory
                await this.inventoryService.edit(inventoryItem.inventory_id, {
                    quantity_available: updatedInventoryItemQuantity,
                })
            })

        })

        // delete order items
        await Promise.each(orderItems, async orderItem => {
            await this.orderItemService.delete(orderItem.order_item_id)
        })

        // delete order
        await this.orderRepository.update({order_id}, {status: 'cancelled'})

        return {deleted: true}
    }

    /**
     * Return specific n item specified by order_id
     * @param order_id String
     */
    async getOne(order_id: string) {
        return this.orderRepository.findOne({ where: { order_id } })
    }

    /**
     * Return all order items
     */
    async getAll() {
        return this.orderRepository.find();
    }
}
