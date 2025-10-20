import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateUnitDto, UpdateUnitDto } from './dto';
import { ResponseUtil } from '../../shared/utils';

@Injectable()
export class UnitService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUnitDto: CreateUnitDto) {
    // Check if unit code already exists
    const existingUnit = await this.prisma.unit.findUnique({
      where: { code: createUnitDto.code },
    });

    if (existingUnit) {
      throw new ConflictException('Unit with this code already exists');
    }

    const unit = await this.prisma.unit.create({
      data: createUnitDto,
    });

    return ResponseUtil.success(unit, 'Unit created successfully');
  }

  async findAllWithoutPagination() {
    const units = await this.prisma.unit.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return ResponseUtil.success(units, 'All units retrieved successfully');
  }

  async findOne(id: string) {
    const unit = await this.prisma.unit.findUnique({
      where: { id },
    });

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    return ResponseUtil.success(unit, 'Unit retrieved successfully');
  }

  async update(id: string, updateUnitDto: UpdateUnitDto) {
    // Check if unit exists
    const existingUnit = await this.prisma.unit.findUnique({
      where: { id },
    });

    if (!existingUnit) {
      throw new NotFoundException('Unit not found');
    }

    // Check if new code conflicts with existing units
    if (
      'code' in updateUnitDto &&
      updateUnitDto.code &&
      updateUnitDto.code !== existingUnit.code
    ) {
      const codeExists = await this.prisma.unit.findUnique({
        where: { code: updateUnitDto.code as string },
      });

      if (codeExists) {
        throw new ConflictException('Unit with this code already exists');
      }
    }

    const unit = await this.prisma.unit.update({
      where: { id },
      data: updateUnitDto,
    });

    return ResponseUtil.success(unit, 'Unit updated successfully');
  }

  async remove(id: string) {
    // Check if unit exists
    const existingUnit = await this.prisma.unit.findUnique({
      where: { id },
    });

    if (!existingUnit) {
      throw new NotFoundException('Unit not found');
    }

    // Check if unit is being used by products
    const productsUsingUnit = await this.prisma.product.findFirst({
      where: { unitId: id },
    });

    if (productsUsingUnit) {
      throw new ConflictException(
        'Cannot delete unit that is being used by products',
      );
    }

    await this.prisma.unit.delete({
      where: { id },
    });

    return ResponseUtil.success(null, 'Unit deleted successfully');
  }
}
