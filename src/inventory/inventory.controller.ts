import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryDTO } from './inventory.dto';

/**
 * Inventory Controller
 */
@Controller('inventories')
export class InventoryController {
    constructor(private inventoryService: InventoryService) {}

    /**
     * Create an inventory object
     * @param data Object
     */
    @Post()
    create(@Body() data: InventoryDTO) {
        return this.inventoryService.add(data)
    }

    /**
     * Update inventory item
     * @param id String 
     * @param data Object
     */
    @Put(':id')
    update(@Param('id') id: string, @Body() body: Partial<InventoryDTO>) {
        return this.inventoryService.edit(id, body)
    }

    /**
     * Delete invetory item
     * @param id String
     */
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.inventoryService.delete(id)
    }

    /**
     * Get all inventory items
     */
    @Get()
    find() {
        return this.inventoryService.getAll()
    }

    /**
     * Get a specific invetory item
     * @param id String
     */
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.inventoryService.getOne(id)
    }
}
