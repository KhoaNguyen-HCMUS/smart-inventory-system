import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto, UpdateSupplierDto } from './dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';

@Controller('api/suppliers')
@UseGuards(JwtAuthGuard)
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  create(@Body() createSupplierDto: CreateSupplierDto, @Request() req: any) {
    return this.supplierService.create(createSupplierDto, req.user.id);
  }

  @Get()
  findAll(@Query('isActive') isActive: string, @Request() req: any) {
    const isActiveBool =
      isActive !== undefined ? isActive === 'true' : undefined;
    return this.supplierService.findAll(req.user.id, isActiveBool);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.supplierService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
    @Request() req: any,
  ) {
    return this.supplierService.update(id, updateSupplierDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.supplierService.remove(id, req.user.id);
  }
}
