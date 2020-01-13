import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

/**
 * Inventory Entity
 */
@Entity('inventory')
export class InventoryEntity {
    @PrimaryGeneratedColumn('uuid') id: string
    @Column('text') name: string
    @Column('text') description: string
    @Column('int8') price: number
    @Column('int8') quantity_available: number
}