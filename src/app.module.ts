import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { InventoryModule } from './inventory/inventory.module'

/**
 * Main Module
 */
@Module({
  imports: [TypeOrmModule.forRoot(), InventoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
