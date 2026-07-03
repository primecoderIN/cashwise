import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async getCategories(userId: string) {
    return this.prisma.category.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createCategory(userId: string, data: { name: string; color: string; icon: string }) {
    try {
      const category = await this.prisma.category.create({
        data: {
          ...data,
          userId,
        },
      });
      return { success: true, category };
    } catch (error) {
      throw new BadRequestException('Failed to create category');
    }
  }

  async deleteCategory(userId: string, categoryId: string) {
    try {
      await this.prisma.category.delete({
        where: {
          id: categoryId,
          userId, // Ensure they only delete their own
        },
      });
      return { success: true };
    } catch (error) {
      throw new BadRequestException('Failed to delete category');
    }
  }
}
