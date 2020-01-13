import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryDTO } from './inventory.dto';

/**
 * Inventory Controller
 */
@Controller('inventory')
export class InventoryController {
    constructor(private inventoryService: InventoryService) {}

    /**
     * Create an inventory object
     * @param data Object
     */
    @Post()
    createInventoryItem(@Body() data: InventoryDTO) {
        return this.inventoryService.add(data)
    }

    /**
     * Update inventory item
     * @param id String 
     * @param data Object
     */
    @Put(':id')
    updateInventoryItem(@Param('id') id: string, @Body() data: Partial<InventoryDTO>) {
        return this.inventoryService.edit(id, data)
    }

    /**
     * Delete invetory item
     * @param id String
     */
    @Delete(':id')
    deleteInventoryItem(@Param('id') id: string) {
        return this.inventoryService.delete(id)
    }

    /**
     * Get all inventory items
     */
    @Get()
    getAllInventoryItems() {
        return this.inventoryService.getAll()
    }

    /**
     * Get a specific invetory item
     * @param id String
     */
    @Get(':id')
    getInventoryItem(@Param('id') id: string) {
        return this.inventoryService.getOne(id)
    }
}
