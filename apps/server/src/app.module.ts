import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/user/user.module';
import { HealthModule } from './modules/health/health.module';
import { WarehouseModule } from './modules/warehouse/warehouse.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    HealthModule,
    WarehouseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
