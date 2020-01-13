import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm'

/**
 * Inventory Entity
 */
@Entity('inventory')
@Unique(['name'])
export class InventoryEntity {
    @PrimaryGeneratedColumn('uuid') inventory_id: string
    @Column('text') name: string
    @Column('text') description: string
    @Column('float4') price: number
    @Column('integer') quantity_available: number
}
