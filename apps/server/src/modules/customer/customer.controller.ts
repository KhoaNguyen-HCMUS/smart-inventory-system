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
import { CustomerService } from './customer.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';

@Controller('api/customers')
@UseGuards(JwtAuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto, @Request() req: any) {
    return this.customerService.create(createCustomerDto, req.user.id);
  }

  @Get()
  findAll(@Query('isActive') isActive: string, @Request() req: any) {
    const isActiveBool =
      isActive !== undefined ? isActive === 'true' : undefined;
    return this.customerService.findAll(req.user.id, isActiveBool);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.customerService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @Request() req: any,
  ) {
    return this.customerService.update(id, updateCustomerDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.customerService.remove(id, req.user.id);
  }
}
