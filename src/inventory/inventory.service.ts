import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InventoryEntity } from './inventory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { InventoryDTO } from './inventory.dto';

/**
 * Inventory Service
 */
@Injectable()
export class InventoryService {
    constructor(@InjectRepository(InventoryEntity) private inventoryRepository: Repository<InventoryEntity>) {}

    /**
     * Add invetory item 
     * @param data Object
     */
    async add(data: InventoryDTO) {
        const inventoryItem = await this.inventoryRepository.create(data)
        await this.inventoryRepository.save(inventoryItem)
        return inventoryItem
    }

    /**
     * Update inventory item
     * @param id String
     * @param data Object
     */
    async edit(id: string, data: Partial<InventoryDTO>) {
        await this.inventoryRepository.update({id},data)
        return await this.inventoryRepository.findOne({id})
    }

    /**
     * Delete inventory item
     * @param id String
     */
    async delete(id: string) {
        await this.inventoryRepository.delete({id})
        return {deleted: true}
    }

    /**
     * Return specific invetory item specified by id
     * @param id String
     */
    async getOne(id: string) {
        return await this.inventoryRepository.findOne({ where: { id } })
    }

    /**
     * Return all inventory items
     */
    async getAll() {
        return await this.inventoryRepository.find();
    }
}
