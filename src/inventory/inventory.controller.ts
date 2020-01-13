import { Controller, Get, Post, Put, Delete } from '@nestjs/common';
import { InventoryService } from './inventory.service';

/**
 * Inventory Controller
 */
@Controller('inventory')
export class InventoryController {
    constructor(private inventoryService: InventoryService) {}
    @Post()
    createInventoryItem() {}

    @Get()
    getAllInventoryItems() {}

    @Get(':id')
    getInventoryItem() {

    }
    @Put(':id')
    updateInventoryItem() {

    }
    @Delete(':id')
    deleteInventoryItem() {}
}
