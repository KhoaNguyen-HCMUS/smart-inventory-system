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
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';

@Controller('api/products')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto, @Request() req: any) {
    return this.productService.create(createProductDto, req.user.id);
  }

  @Get()
  findAll(@Query('isActive') isActive: string, @Request() req: any) {
    const isActiveBool =
      isActive !== undefined ? isActive === 'true' : undefined;
    return this.productService.findAll(req.user.id, isActiveBool);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.productService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req: any,
  ) {
    return this.productService.update(id, updateProductDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.productService.remove(id, req.user.id);
  }
}
