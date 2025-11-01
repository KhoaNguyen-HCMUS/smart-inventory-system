import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto, userId: string) {
    if (!createCustomerDto.name) {
      throw new BadRequestException('Customer name is required');
    }

    const name = createCustomerDto.name.trim();

    // Check if customer with same name already exists for this user
    const existingCustomer = await this.prisma.customer.findUnique({
      where: {
        userId_name: {
          userId,
          name,
        },
      },
    });

    if (existingCustomer) {
      throw new ConflictException(
        'Customer with this name already exists for your account',
      );
    }

    // Create customer
    const customer = await this.prisma.customer.create({
      data: {
        userId,
        name,
        phone: createCustomerDto.phone?.trim() || null,
        email: createCustomerDto.email?.trim() || null,
        address: createCustomerDto.address?.trim() || null,
        isActive: createCustomerDto.isActive ?? true,
      },
    });

    return customer;
  }

  async findAll(userId: string, isActive?: boolean) {
    const where: Prisma.CustomerWhereInput = {
      userId,
    };
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const customers = await this.prisma.customer.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return customers;
  }

  async findOne(id: string, userId: string) {
    const customer = await this.prisma.customer.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
    userId: string,
  ) {
    // Check if customer exists and belongs to user
    const existingCustomer = await this.prisma.customer.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingCustomer) {
      throw new NotFoundException('Customer not found');
    }

    // Check if new name conflicts with existing customer
    if (updateCustomerDto.name) {
      const trimmedName = updateCustomerDto.name.trim();
      if (trimmedName !== existingCustomer.name) {
        const nameExists = await this.prisma.customer.findUnique({
          where: {
            userId_name: {
              userId,
              name: trimmedName,
            },
          },
        });

        if (nameExists) {
          throw new ConflictException(
            'Customer with this name already exists for your account',
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
      isActive?: boolean;
    } = {};

    if (updateCustomerDto.name) {
      updateData.name = updateCustomerDto.name.trim();
    }
    if (updateCustomerDto.phone !== undefined) {
      updateData.phone = updateCustomerDto.phone?.trim() || null;
    }
    if (updateCustomerDto.email !== undefined) {
      updateData.email = updateCustomerDto.email?.trim() || null;
    }
    if (updateCustomerDto.address !== undefined) {
      updateData.address = updateCustomerDto.address?.trim() || null;
    }
    if (updateCustomerDto.isActive !== undefined) {
      updateData.isActive = updateCustomerDto.isActive;
    }

    // Update customer
    const customer = await this.prisma.customer.update({
      where: { id },
      data: updateData,
    });

    return customer;
  }

  async remove(id: string, userId: string) {
    // Check if customer exists and belongs to user
    const existingCustomer = await this.prisma.customer.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingCustomer) {
      throw new NotFoundException('Customer not found');
    }

    // Check if customer is being used by stock moves
    const stockMovesUsingCustomer = await this.prisma.stockMove.findFirst({
      where: { customerId: id },
    });

    if (stockMovesUsingCustomer) {
      // Soft delete: set isActive to false
      const customer = await this.prisma.customer.update({
        where: { id },
        data: { isActive: false },
      });

      return { message: 'Customer deactivated successfully', customer };
    }

    // Hard delete if not used
    await this.prisma.customer.delete({
      where: { id },
    });

    return { message: 'Customer deleted successfully' };
  }
}
