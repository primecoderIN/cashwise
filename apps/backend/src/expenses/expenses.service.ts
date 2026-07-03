import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async getExpenses(userId: string) {
    return this.prisma.expense.findMany({
      where: { userId },
      include: {
        category: true,
        group: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async addExpense(userId: string, data: { title: string; amount: number; date: Date; categoryId: string; groupId?: string; notes?: string }) {
    try {
      const expense = await this.prisma.expense.create({
        data: {
          ...data,
          userId,
        },
      });
      return { success: true, expense };
    } catch (error) {
      throw new BadRequestException('Failed to add expense');
    }
  }

  async updateExpense(userId: string, expenseId: string, data: any) {
    try {
      const expense = await this.prisma.expense.update({
        where: { id: expenseId, userId },
        data,
      });
      return { success: true, expense };
    } catch (error) {
      throw new BadRequestException('Failed to update expense');
    }
  }

  async deleteExpense(userId: string, expenseId: string) {
    try {
      await this.prisma.expense.delete({
        where: {
          id: expenseId,
          userId,
        },
      });
      return { success: true };
    } catch (error) {
      throw new BadRequestException('Failed to delete expense');
    }
  }
}
