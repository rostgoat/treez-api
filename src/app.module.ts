import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { InventoryModule } from './inventory/inventory.module'
import { OrderModule } from './order/order.module';
import { OrderItemModule } from './order-item/order-item.module';

/**
 * Main Module
 */
@Module({
  imports: [TypeOrmModule.forRoot(), InventoryModule, OrderModule, OrderItemModule],
})
export class AppModule {}
