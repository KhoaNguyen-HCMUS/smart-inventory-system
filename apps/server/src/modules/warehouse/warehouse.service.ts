import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateWarehouseDto, UpdateWarehouseDto } from './dto';
import { ResponseUtil } from '../../shared/utils';

@Injectable()
export class WarehouseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createWarehouseDto: CreateWarehouseDto) {
    // Check if warehouse code already exists
    const existingWarehouse = await this.prisma.warehouse.findUnique({
      where: { code: createWarehouseDto.code },
    });

    if (existingWarehouse) {
      throw new ConflictException('Warehouse with this code already exists');
    }

    const warehouse = await this.prisma.warehouse.create({
      data: createWarehouseDto,
    });

    return ResponseUtil.success(warehouse, 'Warehouse created successfully');
  }

  async findAll() {
    const warehouses = await this.prisma.warehouse.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return ResponseUtil.success(
      warehouses,
      'All warehouses retrieved successfully',
    );
  }

  async findOne(id: string) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id },
    });

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }

    return ResponseUtil.success(warehouse, 'Warehouse retrieved successfully');
  }

  async update(id: string, updateWarehouseDto: UpdateWarehouseDto) {
    // Check if warehouse exists
    const existingWarehouse = await this.prisma.warehouse.findUnique({
      where: { id },
    });

    if (!existingWarehouse) {
      throw new NotFoundException('Warehouse not found');
    }

    // Check if new code conflicts with existing warehouses
    if (
      'code' in updateWarehouseDto &&
      updateWarehouseDto.code &&
      updateWarehouseDto.code !== existingWarehouse.code
    ) {
      const codeExists = await this.prisma.warehouse.findUnique({
        where: { code: updateWarehouseDto.code as string },
      });

      if (codeExists) {
        throw new ConflictException('Warehouse with this code already exists');
      }
    }

    const warehouse = await this.prisma.warehouse.update({
      where: { id },
      data: updateWarehouseDto,
    });

    return ResponseUtil.success(warehouse, 'Warehouse updated successfully');
  }

  async remove(id: string) {
    // Check if warehouse exists
    const existingWarehouse = await this.prisma.warehouse.findUnique({
      where: { id },
    });

    if (!existingWarehouse) {
      throw new NotFoundException('Warehouse not found');
    }

    // Check if warehouse is being used by documents
    const documentsUsingWarehouse = await this.prisma.document.findFirst({
      where: {
        OR: [{ warehouseFromId: id }, { warehouseToId: id }],
      },
    });

    if (documentsUsingWarehouse) {
      throw new ConflictException(
        'Cannot delete warehouse that is being used by documents',
      );
    }

    await this.prisma.warehouse.delete({
      where: { id },
    });

    return ResponseUtil.success(null, 'Warehouse deleted successfully');
  }
}
