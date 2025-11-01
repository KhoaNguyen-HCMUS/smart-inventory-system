import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateStockMoveDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class StockMoveService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createStockMoveDto: CreateStockMoveDto, userId: string) {
    // Validate product exists and belongs to user
    const product = await this.prisma.product.findFirst({
      where: {
        id: createStockMoveDto.productId,
        userId,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Validate supplier exists if provided
    if (createStockMoveDto.supplierId) {
      const supplier = await this.prisma.supplier.findFirst({
        where: {
          id: createStockMoveDto.supplierId,
          userId,
        },
      });

      if (!supplier) {
        throw new NotFoundException('Supplier not found');
      }
    }

    // Validate customer exists if provided
    if (createStockMoveDto.customerId) {
      const customer = await this.prisma.customer.findFirst({
        where: {
          id: createStockMoveDto.customerId,
          userId,
        },
      });

      if (!customer) {
        throw new NotFoundException('Customer not found');
      }
    }

    // Validate reason and related fields
    if (createStockMoveDto.reason === 'IN' && !createStockMoveDto.supplierId) {
      throw new BadRequestException('Supplier is required for IN transactions');
    }

    if (createStockMoveDto.reason === 'OUT' && !createStockMoveDto.customerId) {
      throw new BadRequestException(
        'Customer is required for OUT transactions',
      );
    }

    // Validate payType - only meaningful for IN transactions
    if (createStockMoveDto.payType && createStockMoveDto.reason !== 'IN') {
      throw new BadRequestException(
        'PayType is only applicable for IN transactions',
      );
    }

    // Validate CREDIT payment requires unitPrice
    if (
      createStockMoveDto.reason === 'IN' &&
      createStockMoveDto.payType === 'CREDIT' &&
      !createStockMoveDto.unitPrice
    ) {
      throw new BadRequestException(
        'Unit price is required for CREDIT payment transactions',
      );
    }

    // Validate qtyDelta - should always be positive (sign is handled by reason)
    if (createStockMoveDto.qtyDelta <= 0) {
      throw new BadRequestException('Quantity must be positive');
    }

    // Calculate qtyDelta sign based on reason
    let qtyDelta = new Prisma.Decimal(createStockMoveDto.qtyDelta);
    if (
      createStockMoveDto.reason === 'OUT' ||
      createStockMoveDto.reason === 'ADJUST'
    ) {
      qtyDelta = qtyDelta.negated(); // Negative for OUT and ADJUST
    }

    // Create stock move (use transaction for CREDIT payment)
    if (
      createStockMoveDto.reason === 'IN' &&
      createStockMoveDto.payType === 'CREDIT' &&
      createStockMoveDto.supplierId &&
      createStockMoveDto.unitPrice
    ) {
      // Use transaction to create stock move and payable ledger together
      // At this point, supplierId and unitPrice are guaranteed to be defined
      const supplierId = createStockMoveDto.supplierId;
      const unitPrice = createStockMoveDto.unitPrice;

      const result = await this.prisma.$transaction(async (tx) => {
        // Create stock move
        const stockMove = await tx.stockMove.create({
          data: {
            userId,
            productId: createStockMoveDto.productId,
            qtyDelta,
            reason: createStockMoveDto.reason,
            supplierId,
            unitPrice: new Prisma.Decimal(unitPrice),
            payType: createStockMoveDto.payType,
            note: createStockMoveDto.note?.trim() || null,
          },
        });

        // Calculate total amount
        const totalAmount = Number(qtyDelta) * Number(unitPrice);

        // Create payable ledger entry (BILL)
        await tx.payableLedger.create({
          data: {
            userId,
            supplierId,
            type: 'BILL',
            amountDelta: new Prisma.Decimal(totalAmount), // Positive for BILL
            note:
              createStockMoveDto.note?.trim() ||
              `Purchase invoice for ${product.name} - Qty: ${createStockMoveDto.qtyDelta}`,
            refMoveId: stockMove.id,
          },
        });

        // Return stock move with relations
        return tx.stockMove.findUnique({
          where: { id: stockMove.id },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                unitCode: true,
              },
            },
            supplier: {
              select: {
                id: true,
                name: true,
              },
            },
            customer: {
              select: {
                id: true,
                name: true,
              },
            },
            user: {
              select: {
                id: true,
                displayName: true,
                email: true,
              },
            },
          },
        });
      });

      return result!;
    } else {
      // Regular stock move (non-CREDIT or no unitPrice)
      const stockMove = await this.prisma.stockMove.create({
        data: {
          userId,
          productId: createStockMoveDto.productId,
          qtyDelta,
          reason: createStockMoveDto.reason,
          supplierId: createStockMoveDto.supplierId || null,
          customerId: createStockMoveDto.customerId || null,
          unitPrice: createStockMoveDto.unitPrice
            ? new Prisma.Decimal(createStockMoveDto.unitPrice)
            : null,
          payType: createStockMoveDto.payType || null,
          note: createStockMoveDto.note?.trim() || null,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              unitCode: true,
            },
          },
          supplier: {
            select: {
              id: true,
              name: true,
            },
          },
          customer: {
            select: {
              id: true,
              name: true,
            },
          },
          user: {
            select: {
              id: true,
              displayName: true,
              email: true,
            },
          },
        },
      });

      return stockMove;
    }
  }

  async findAll(
    userId: string,
    filters?: {
      productId?: string;
      supplierId?: string;
      customerId?: string;
      reason?: string;
      startDate?: Date;
      endDate?: Date;
    },
  ) {
    const where: Prisma.StockMoveWhereInput = {
      userId,
    };

    if (filters?.productId) {
      where.productId = filters.productId;
    }

    if (filters?.supplierId) {
      where.supplierId = filters.supplierId;
    }

    if (filters?.customerId) {
      where.customerId = filters.customerId;
    }

    if (filters?.reason) {
      where.reason = filters.reason as any;
    }

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    const stockMoves = await this.prisma.stockMove.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            unitCode: true,
          },
        },
        supplier: {
          select: {
            id: true,
            name: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            displayName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return stockMoves;
  }

  async findOne(id: string, userId: string) {
    const stockMove = await this.prisma.stockMove.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            unitCode: true,
          },
        },
        supplier: {
          select: {
            id: true,
            name: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            displayName: true,
            email: true,
          },
        },
      },
    });

    if (!stockMove) {
      throw new NotFoundException('Stock move not found');
    }

    return stockMove;
  }

  async getStockByProduct(productId: string, userId: string) {
    // Verify product belongs to user
    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
        userId,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const stockMoves = await this.prisma.stockMove.findMany({
      where: {
        productId,
        userId,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Calculate current stock (qtyDelta already has correct sign)
    const currentStock = stockMoves.reduce((total, move) => {
      return total + Number(move.qtyDelta);
    }, 0);

    return {
      productId,
      currentStock,
      totalMoves: stockMoves.length,
    };
  }
}
