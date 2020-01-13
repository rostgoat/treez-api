import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { InventoryModule } from './inventory/inventory.module'
import { OrderModule } from './order/order.module';

/**
 * Main Module
 */
@Module({
  imports: [TypeOrmModule.forRoot(), InventoryModule, OrderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
