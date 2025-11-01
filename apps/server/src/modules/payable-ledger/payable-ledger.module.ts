import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { PayableLedgerController } from './payable-ledger.controller';
import { PayableLedgerService } from './payable-ledger.service';

@Module({
  imports: [PrismaModule],
  controllers: [PayableLedgerController],
  providers: [PayableLedgerService],
  exports: [PayableLedgerService],
})
export class PayableLedgerModule {}
