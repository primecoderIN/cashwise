import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * CategoriesService — manages expense categories per user.
 * Categories are used to classify expenses (e.g. "Food", "Travel").
 * Each category has a name, icon (Lucide icon key), and color (hex string).
 */
@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  /**
   * getCategories — returns all categories owned by the user, newest first.
   */
  async getCategories(userId: string) {
    return this.prisma.category.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * createCategory — creates a new category for the user.
   * The schema enforces a unique constraint on (name, userId) so the same
   * user cannot create duplicate category names. Prisma throws a P2002 error
   * in that case, which we catch and convert to a 400.
   */
  async createCategory(userId: string, data: { name: string; color: string; icon: string }) {
    try {
      const category = await this.prisma.category.create({
        data: { ...data, userId },
      });
      return { success: true, category };
    } catch (error) {
      // Catches FK violations, unique constraint errors, etc.
      throw new BadRequestException('Failed to create category');
    }
  }

  /**
   * deleteCategory — removes a category by ID.
   * The compound `where: { id, userId }` ensures users can only delete their own.
   * Note: If expenses reference this category, Prisma will throw a FK constraint
   * error — the frontend shows "Cannot delete — expenses are linked to it."
   */
  async deleteCategory(userId: string, categoryId: string) {
    try {
      await this.prisma.category.delete({
        where: { id: categoryId, userId },
      });
      return { success: true };
    } catch (error) {
      throw new BadRequestException('Failed to delete category');
    }
  }
}
