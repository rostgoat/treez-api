import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemService } from './order-item.service';
import { OrderItemEntity } from './order-item.entity';

@Global()
@Module({
  providers: [OrderItemService],
  exports: [OrderItemService],
  imports: [TypeOrmModule.forFeature([OrderItemEntity])],
})
export class OrderItemModule {}
