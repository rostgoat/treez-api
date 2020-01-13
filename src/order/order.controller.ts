import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDTO } from './order.dto';

/**
 * Order Controller
 */
@Controller('orders')
export class OrderController {
    constructor(private orderService: OrderService) {}

    /**
     * Create an order object
     * @param data Object
     */
    @Post()
    create(@Body() data: OrderDTO) {
        return this.orderService.add(data)
    }

    /**
     * Update order item
     * @param order_id String
     * @param data Object
     */
    @Put(':id')
    update(@Param('id') order_id: string, @Body() body: Partial<OrderDTO>) {
        return this.orderService.edit(order_id, body)
    }

    /**
     * Delete order item
     * @param order_id String
     */
    @Delete(':id')
    delete(@Param('id') order_id: string, @Body() body: Partial<OrderDTO>) {
        return this.orderService.delete(order_id, body)
    }

    /**
     * Get all Order items
     */
    @Get()
    find() {
        return this.orderService.getAll()
    }

    /**
     * Get a specific order item
     * @param order_id String
     */
    @Get(':id')
    findOne(@Param('id') order_id: string) {
        return this.orderService.getOne(order_id)
    }
}
