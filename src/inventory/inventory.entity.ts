import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm'

/**
 * Inventory Entity
 */
@Entity('inventory')
@Unique(['name'])
export class InventoryEntity {
    @PrimaryGeneratedColumn('uuid') id: string
    @Column('text') name: string
    @Column('text') description: string
    @Column('float4') price: number
    @Column('int8') quantity_available: number
}
