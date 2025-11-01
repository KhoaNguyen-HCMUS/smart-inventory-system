import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreatePayableLedgerDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PayableLedgerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPayableLedgerDto: CreatePayableLedgerDto, userId: string) {
    // Validate supplier exists and belongs to user
    const supplier = await this.prisma.supplier.findFirst({
      where: {
        id: createPayableLedgerDto.supplierId,
        userId,
      },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    // Validate refMoveId if provided
    if (createPayableLedgerDto.refMoveId) {
      const stockMove = await this.prisma.stockMove.findFirst({
        where: {
          id: createPayableLedgerDto.refMoveId,
          userId,
          supplierId: createPayableLedgerDto.supplierId,
        },
      });

      if (!stockMove) {
        throw new NotFoundException('Referenced stock move not found');
      }
    }

    // Calculate amountDelta sign based on type
    let amountDelta = new Prisma.Decimal(createPayableLedgerDto.amountDelta);
    if (
      createPayableLedgerDto.type === 'PAYMENT' ||
      createPayableLedgerDto.type === 'ADJUST'
    ) {
      amountDelta = amountDelta.negated(); // Negative for PAYMENT and ADJUST
    }

    // Create payable ledger entry
    const ledger = await this.prisma.payableLedger.create({
      data: {
        userId,
        supplierId: createPayableLedgerDto.supplierId,
        type: createPayableLedgerDto.type,
        amountDelta,
        note: createPayableLedgerDto.note?.trim() || null,
        refMoveId: createPayableLedgerDto.refMoveId || null,
      },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
          },
        },
        refMove: {
          select: {
            id: true,
            productId: true,
            qtyDelta: true,
            unitPrice: true,
          },
          include: {
            product: {
              select: {
                id: true,
                name: true,
              },
            },
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

    return ledger;
  }

  async findAll(
    userId: string,
    filters?: {
      supplierId?: string;
      type?: string;
      startDate?: Date;
      endDate?: Date;
    },
  ) {
    const where: Prisma.PayableLedgerWhereInput = {
      userId,
    };

    if (filters?.supplierId) {
      where.supplierId = filters.supplierId;
    }

    if (filters?.type) {
      where.type = filters.type as any;
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

    const ledgers = await this.prisma.payableLedger.findMany({
      where,
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
          },
        },
        refMove: {
          select: {
            id: true,
            productId: true,
            qtyDelta: true,
            unitPrice: true,
          },
          include: {
            product: {
              select: {
                id: true,
                name: true,
              },
            },
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

    return ledgers;
  }

  async findOne(id: string, userId: string) {
    const ledger = await this.prisma.payableLedger.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
          },
        },
        refMove: {
          select: {
            id: true,
            productId: true,
            qtyDelta: true,
            unitPrice: true,
          },
          include: {
            product: {
              select: {
                id: true,
                name: true,
              },
            },
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

    if (!ledger) {
      throw new NotFoundException('Payable ledger not found');
    }

    return ledger;
  }

  async getPayableBalance(supplierId: string, userId: string) {
    // Verify supplier exists and belongs to user
    const supplier = await this.prisma.supplier.findFirst({
      where: {
        id: supplierId,
        userId,
      },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    const ledgers = await this.prisma.payableLedger.findMany({
      where: {
        supplierId,
        userId,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Calculate balance (amountDelta already has correct sign)
    const balance = ledgers.reduce((total, ledger) => {
      return total + Number(ledger.amountDelta);
    }, 0);

    return {
      supplierId,
      balance,
      totalLedgers: ledgers.length,
    };
  }

  async findBySupplier(supplierId: string, userId: string) {
    // Verify supplier exists and belongs to user
    const supplier = await this.prisma.supplier.findFirst({
      where: {
        id: supplierId,
        userId,
      },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    const ledgers = await this.prisma.payableLedger.findMany({
      where: {
        supplierId,
        userId,
      },
      include: {
        refMove: {
          select: {
            id: true,
            productId: true,
            qtyDelta: true,
            unitPrice: true,
          },
          include: {
            product: {
              select: {
                id: true,
                name: true,
              },
            },
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

    return ledgers;
  }
}
