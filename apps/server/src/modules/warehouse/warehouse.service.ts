import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateWarehouseDto, UpdateWarehouseDto } from './dto';

@Injectable()
export class WarehouseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createWarehouseDto: CreateWarehouseDto) {
    // Normalize code to uppercase
    const normalizedCode = createWarehouseDto.code.toUpperCase().trim();

    // Validate input
    if (!normalizedCode || !createWarehouseDto.name) {
      throw new BadRequestException('Code and name are required');
    }

    // Check if warehouse code already exists
    const existingWarehouse = await this.prisma.warehouse.findUnique({
      where: { code: normalizedCode },
    });

    if (existingWarehouse) {
      throw new ConflictException('Warehouse with this code already exists');
    }

    // Create warehouse
    const warehouse = await this.prisma.warehouse.create({
      data: {
        code: normalizedCode,
        name: createWarehouseDto.name.trim(),
        address: createWarehouseDto.address?.trim() || null,
      },
    });

    return warehouse;
  }

  async findAll() {
    const warehouses = await this.prisma.warehouse.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return warehouses;
  }

  async findOne(id: string) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id },
    });

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }

    return warehouse;
  }

  async update(id: string, updateWarehouseDto: UpdateWarehouseDto) {
    // Check if warehouse exists
    const existingWarehouse = await this.prisma.warehouse.findUnique({
      where: { id },
    });

    if (!existingWarehouse) {
      throw new NotFoundException('Warehouse not found');
    }

    // Normalize code if provided
    let normalizedCode = updateWarehouseDto.code;
    if (updateWarehouseDto.code) {
      normalizedCode = updateWarehouseDto.code.toUpperCase().trim();

      // Check if new code conflicts with existing warehouses
      if (normalizedCode !== existingWarehouse.code) {
        const codeExists = await this.prisma.warehouse.findUnique({
          where: { code: normalizedCode },
        });

        if (codeExists) {
          throw new ConflictException(
            'Warehouse with this code already exists',
          );
        }
      }
    }

    // Prepare update data
    const updateData: {
      code?: string;
      name?: string;
      address?: string | null;
    } = {};

    if (normalizedCode) updateData.code = normalizedCode;
    if (updateWarehouseDto.name) {
      updateData.name = updateWarehouseDto.name.trim();
    }
    if ('address' in updateWarehouseDto) {
      updateData.address = updateWarehouseDto.address?.trim() || null;
    }

    // Update warehouse
    const warehouse = await this.prisma.warehouse.update({
      where: { id },
      data: updateData,
    });

    return warehouse;
  }

  async remove(id: string) {
    // Check if warehouse exists
    const existingWarehouse = await this.prisma.warehouse.findUnique({
      where: { id },
    });

    if (!existingWarehouse) {
      throw new NotFoundException('Warehouse not found');
    }

    // Check if warehouse is being used by stock moves
    const stockMovesUsingWarehouse = await this.prisma.stockMove.findFirst({
      where: { warehouseId: id },
    });

    if (stockMovesUsingWarehouse) {
      throw new ConflictException(
        'Cannot delete warehouse that is being used by stock moves',
      );
    }

    // Delete warehouse
    await this.prisma.warehouse.delete({
      where: { id },
    });

    return { message: 'Warehouse deleted successfully' };
  }
}
