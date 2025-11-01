import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PayableLedgerService } from './payable-ledger.service';
import { CreatePayableLedgerDto } from './dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';

@Controller('api/payable-ledgers')
@UseGuards(JwtAuthGuard)
export class PayableLedgerController {
  constructor(private readonly payableLedgerService: PayableLedgerService) {}

  @Post()
  create(
    @Body() createPayableLedgerDto: CreatePayableLedgerDto,
    @Request() req: any,
  ) {
    return this.payableLedgerService.create(
      createPayableLedgerDto,
      req.user.id,
    );
  }

  @Get()
  findAll(
    @Query('supplierId') supplierId?: string,
    @Query('type') type?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Request() req?: any,
  ) {
    const filters: any = {};
    if (supplierId) filters.supplierId = supplierId;
    if (type) filters.type = type;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);

    return this.payableLedgerService.findAll(req.user.id, filters);
  }

  @Get('supplier/:supplierId/balance')
  getBalance(@Param('supplierId') supplierId: string, @Request() req: any) {
    return this.payableLedgerService.getPayableBalance(supplierId, req.user.id);
  }

  @Get('supplier/:supplierId')
  findBySupplier(@Param('supplierId') supplierId: string, @Request() req: any) {
    return this.payableLedgerService.findBySupplier(supplierId, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.payableLedgerService.findOne(id, req.user.id);
  }
}
