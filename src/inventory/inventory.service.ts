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
     * @param inventory_id String
     * @param data Object
     */
    async edit(inventory_id: string, data: Partial<InventoryDTO>) {
        await this.inventoryRepository.update({inventory_id}, data)
        return await this.inventoryRepository.findOne({inventory_id})
    }

    /**
     * Delete inventory item
     * @param inventory_id String
     */
    async delete(inventory_id: string) {
        await this.inventoryRepository.delete({inventory_id})
        return {deleted: true}
    }

    /**
     * Return specific invetory item specified by inventory_id
     * @param inventory_id String
     */
    async getOne(inventory_id: string) {
        return await this.inventoryRepository.findOne({ where: { inventory_id } })
    }

    /**
     * Return specific invetory item specified by name
     * @param name String
     */
    async getOneByName(name: string) {
        return await this.inventoryRepository.findOne({ where: { name } })
    }

    /**
     * Return all inventory items
     */
    async getAll() {
        return await this.inventoryRepository.find();
    }
}
