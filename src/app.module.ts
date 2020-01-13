import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { InventoryModule } from './inventory/inventory.module'
import { OrderModule } from './order/order.module';
import { OrderItemModule } from './order-item/order-item.module';

/**
 * Main Module
 */
@Module({
  imports: [TypeOrmModule.forRoot(), InventoryModule, OrderModule, OrderItemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
