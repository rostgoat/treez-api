import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InventoryEntity } from './inventory.entity';
import { InjectRepository } from '@nestjs/typeorm';

/**
 * Inventory Service
 */
@Injectable()
export class InventoryService {
    constructor(@InjectRepository(InventoryEntity) private inventoryRepository: Repository<InventoryEntity>) {}

    async add(data) {
        const inventoryItem = await this.inventoryRepository.create(data)
        await this.inventoryRepository.save(inventoryItem)
        return inventoryItem
    }

    async edit(id: string, data) {
        await this.inventoryRepository.update({id},data)
        return await this.inventoryRepository.findOne({id})
    }

    async delete(id: string) {
        await this.inventoryRepository.delete({id})
        return {deleted: true}
    }

    async getOne(id: string) {
        return await this.inventoryRepository.findOne({ where: { id } })
    }

    async getAll() {
        return await this.inventoryRepository.find();
    }
}
