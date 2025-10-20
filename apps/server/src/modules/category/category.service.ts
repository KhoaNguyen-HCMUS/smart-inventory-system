import { CreateCategoryDto } from './dto/create-category.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { ResponseUtil } from 'src/shared/utils/response.util';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    // Check existing category
    const existingCategory = await this.prisma.category.findFirst({
      where: { name: createCategoryDto.name },
    });

    if (existingCategory) {
      throw new Error('Category with this name already exists');
    }

    const newCategory = await this.prisma.category.create({
      data: {
        name: CreateCategoryDto.name,
      },
    });
    return ResponseUtil.success(newCategory, 'Category created successfully');
  }

  async getAllCategories() {
    const categories = await this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    return ResponseUtil.success(
      categories,
      'Categories retrieved successfully',
    );
  }

  async getCategoryById(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new Error('Category not found');
    }
    return ResponseUtil.success(category, 'Category retrieved successfully');
  }

  async deleteCategory(id: string) {
    const productsUsingCategory = await this.prisma.product.findFirst({
      where: { categoryId: id },
    });

    if (productsUsingCategory) {
      throw new Error(
        'Cannot delete category as it is associated with existing products',
      );
    }

    await this.prisma.category.delete({
      where: { id },
    });
    return ResponseUtil.success(null, 'Category deleted successfully');
  }

  async updateCategory(id: string, updateCategoryDto: CreateCategoryDto) {
    const category = await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
    return ResponseUtil.success(category, 'Category updated successfully');
  }
}
