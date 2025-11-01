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
import { StockMoveService } from './stock-move.service';
import { CreateStockMoveDto } from './dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';

@Controller('api/stock-moves')
export class StockMoveController {
  constructor(private readonly stockMoveService: StockMoveService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createStockMoveDto: CreateStockMoveDto, @Request() req: any) {
    return this.stockMoveService.create(createStockMoveDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('productId') productId?: string,
    @Query('supplierId') supplierId?: string,
    @Query('customerId') customerId?: string,
    @Query('reason') reason?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Request() req?: any,
  ) {
    const filters: any = {};
    if (productId) filters.productId = productId;
    if (supplierId) filters.supplierId = supplierId;
    if (customerId) filters.customerId = customerId;
    if (reason) filters.reason = reason;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);

    return this.stockMoveService.findAll(req.user.id, filters);
  }

  @UseGuards(JwtAuthGuard)
  @Get('stock/:productId')
  getStock(@Param('productId') productId: string, @Request() req: any) {
    return this.stockMoveService.getStockByProduct(productId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.stockMoveService.findOne(id, req.user.id);
  }
}
