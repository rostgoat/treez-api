import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderEntity } from './order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { InventoryModule } from '../inventory/inventory.module';
import { OrderItemModule } from '../order-item/order-item.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]), InventoryModule, OrderItemModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
