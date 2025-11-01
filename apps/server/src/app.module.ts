import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/user/user.module';
import { HealthModule } from './modules/health/health.module';
import { ProductModule } from './modules/product/product.module';
import { SupplierModule } from './modules/supplier/supplier.module';
import { CustomerModule } from './modules/customer/customer.module';
import { StockMoveModule } from './modules/stock-move/stock-move.module';
import { PayableLedgerModule } from './modules/payable-ledger/payable-ledger.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    HealthModule,
    ProductModule,
    SupplierModule,
    CustomerModule,
    StockMoveModule,
    PayableLedgerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
