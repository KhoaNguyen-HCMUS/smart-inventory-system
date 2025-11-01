import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto, userId: string) {
    // Validate input
    if (!createProductDto.name) {
      throw new BadRequestException('Product name is required');
    }

    const name = createProductDto.name.trim();

    // Check if product with same name already exists for this user
    const existingProduct = await this.prisma.product.findUnique({
      where: {
        userId_name: {
          userId,
          name,
        },
      },
    });

    if (existingProduct) {
      throw new ConflictException(
        'Product with this name already exists for your account',
      );
    }

    // Create product
    const product = await this.prisma.product.create({
      data: {
        userId,
        name,
        unitCode: createProductDto.unitCode?.trim() || 'pcs',
        costPrice: createProductDto.costPrice
          ? new Prisma.Decimal(createProductDto.costPrice)
          : null,
        salePrice: createProductDto.salePrice
          ? new Prisma.Decimal(createProductDto.salePrice)
          : null,
        isActive: createProductDto.isActive ?? true,
      },
    });

    return product;
  }

  async findAll(userId: string, isActive?: boolean) {
    const where: Prisma.ProductWhereInput = {
      userId,
    };
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const products = await this.prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return products;
  }

  async findOne(id: string, userId: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto, userId: string) {
    // Check if product exists and belongs to user
    const existingProduct = await this.prisma.product.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    // Check if new name conflicts with existing product
    if (updateProductDto.name) {
      const trimmedName = updateProductDto.name.trim();
      if (trimmedName !== existingProduct.name) {
        const nameExists = await this.prisma.product.findUnique({
          where: {
            userId_name: {
              userId,
              name: trimmedName,
            },
          },
        });

        if (nameExists) {
          throw new ConflictException(
            'Product with this name already exists for your account',
          );
        }
      }
    }

    // Prepare update data
    const updateData: {
      name?: string;
      unitCode?: string;
      costPrice?: Prisma.Decimal | null;
      salePrice?: Prisma.Decimal | null;
      isActive?: boolean;
    } = {};

    if (updateProductDto.name) {
      updateData.name = updateProductDto.name.trim();
    }
    if (updateProductDto.unitCode !== undefined) {
      updateData.unitCode = updateProductDto.unitCode.trim() || 'pcs';
    }
    if (updateProductDto.costPrice !== undefined) {
      updateData.costPrice = updateProductDto.costPrice
        ? new Prisma.Decimal(updateProductDto.costPrice)
        : null;
    }
    if (updateProductDto.salePrice !== undefined) {
      updateData.salePrice = updateProductDto.salePrice
        ? new Prisma.Decimal(updateProductDto.salePrice)
        : null;
    }
    if (updateProductDto.isActive !== undefined) {
      updateData.isActive = updateProductDto.isActive;
    }

    // Update product
    const product = await this.prisma.product.update({
      where: { id },
      data: updateData,
    });

    return product;
  }

  async remove(id: string, userId: string) {
    // Check if product exists and belongs to user
    const existingProduct = await this.prisma.product.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    // Check if product is being used by stock moves
    const stockMovesUsingProduct = await this.prisma.stockMove.findFirst({
      where: { productId: id },
    });

    if (stockMovesUsingProduct) {
      // Soft delete: set isActive to false instead of hard delete
      const product = await this.prisma.product.update({
        where: { id },
        data: { isActive: false },
      });

      return { message: 'Product deactivated successfully', product };
    }

    // Hard delete if not used
    await this.prisma.product.delete({
      where: { id },
    });

    return { message: 'Product deleted successfully' };
  }
}
