import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { StockMoveController } from './stock-move.controller';
import { StockMoveService } from './stock-move.service';

@Module({
  imports: [PrismaModule],
  controllers: [StockMoveController],
  providers: [StockMoveService],
  exports: [StockMoveService],
})
export class StockMoveModule {}
