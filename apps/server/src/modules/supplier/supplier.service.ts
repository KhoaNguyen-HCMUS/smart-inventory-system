import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateSupplierDto, UpdateSupplierDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SupplierService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSupplierDto: CreateSupplierDto, userId: string) {
    if (!createSupplierDto.name) {
      throw new BadRequestException('Supplier name is required');
    }

    const name = createSupplierDto.name.trim();

    // Check if supplier with same name already exists for this user
    const existingSupplier = await this.prisma.supplier.findUnique({
      where: {
        userId_name: {
          userId,
          name,
        },
      },
    });

    if (existingSupplier) {
      throw new ConflictException(
        'Supplier with this name already exists for your account',
      );
    }

    // Create supplier
    const supplier = await this.prisma.supplier.create({
      data: {
        userId,
        name,
        phone: createSupplierDto.phone?.trim() || null,
        email: createSupplierDto.email?.trim() || null,
        address: createSupplierDto.address?.trim() || null,
        allowDebt: createSupplierDto.allowDebt ?? true,
        isActive: true,
      },
    });

    return supplier;
  }

  async findAll(userId: string, isActive?: boolean) {
    const where: Prisma.SupplierWhereInput = {
      userId,
    };
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const suppliers = await this.prisma.supplier.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return suppliers;
  }

  async findOne(id: string, userId: string) {
    const supplier = await this.prisma.supplier.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    return supplier;
  }

  async update(
    id: string,
    updateSupplierDto: UpdateSupplierDto,
    userId: string,
  ) {
    // Check if supplier exists and belongs to user
    const existingSupplier = await this.prisma.supplier.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingSupplier) {
      throw new NotFoundException('Supplier not found');
    }

    // Check if new name conflicts with existing supplier
    if (updateSupplierDto.name) {
      const trimmedName = updateSupplierDto.name.trim();
      if (trimmedName !== existingSupplier.name) {
        const nameExists = await this.prisma.supplier.findUnique({
          where: {
            userId_name: {
              userId,
              name: trimmedName,
            },
          },
        });

        if (nameExists) {
          throw new ConflictException(
            'Supplier with this name already exists for your account',
          );
        }
      }
    }

    // Prepare update data
    const updateData: {
      name?: string;
      phone?: string | null;
      email?: string | null;
      address?: string | null;
      allowDebt?: boolean;
      isActive?: boolean;
    } = {};

    if (updateSupplierDto.name) {
      updateData.name = updateSupplierDto.name.trim();
    }
    if (updateSupplierDto.phone !== undefined) {
      updateData.phone = updateSupplierDto.phone?.trim() || null;
    }
    if (updateSupplierDto.email !== undefined) {
      updateData.email = updateSupplierDto.email?.trim() || null;
    }
    if (updateSupplierDto.address !== undefined) {
      updateData.address = updateSupplierDto.address?.trim() || null;
    }
    if (updateSupplierDto.allowDebt !== undefined) {
      updateData.allowDebt = updateSupplierDto.allowDebt;
    }
    if (updateSupplierDto.isActive !== undefined) {
      updateData.isActive = updateSupplierDto.isActive;
    }

    // Update supplier
    const supplier = await this.prisma.supplier.update({
      where: { id },
      data: updateData,
    });

    return supplier;
  }

  async remove(id: string, userId: string) {
    // Check if supplier exists and belongs to user
    const existingSupplier = await this.prisma.supplier.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingSupplier) {
      throw new NotFoundException('Supplier not found');
    }

    // Check if supplier is being used by stock moves
    const stockMovesUsingSupplier = await this.prisma.stockMove.findFirst({
      where: { supplierId: id },
    });

    if (stockMovesUsingSupplier) {
      // Soft delete: set isActive to false
      const supplier = await this.prisma.supplier.update({
        where: { id },
        data: { isActive: false },
      });

      return { message: 'Supplier deactivated successfully', supplier };
    }

    // Hard delete if not used
    await this.prisma.supplier.delete({
      where: { id },
    });

    return { message: 'Supplier deleted successfully' };
  }
}
