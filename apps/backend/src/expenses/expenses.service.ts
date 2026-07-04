import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * ExpensesService — handles all CRUD operations for the Expense model.
 * Every method is scoped to a specific userId (DB UUID) to ensure
 * users cannot read or modify each other's data.
 */
@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  /**
   * getExpenses — fetches all expenses for a user, newest first.
   * Includes the related Category and ExpenseGroup for display in the table.
   */
  async getExpenses(userId: string) {
    return this.prisma.expense.findMany({
      where: { userId },
      include: {
        category: true, // needed for badge color and name in the table
        group: true,    // nullable — shows "—" if not grouped
      },
      orderBy: { date: 'desc' },
    });
  }

  /**
   * addExpense — creates a new expense record linked to the authenticated user.
   * Wraps in try/catch to return a clean 400 instead of a raw Prisma error
   * (e.g. if the categoryId FK doesn't exist).
   */
  async addExpense(
    userId: string,
    data: { title: string; amount: number; date: Date; categoryId: string; groupId?: string; notes?: string },
  ) {
    try {
      const expense = await this.prisma.expense.create({
        data: {
          ...data,
          userId, // bind to the authenticated user
        },
      });
      return { success: true, expense };
    } catch (error) {
      throw new BadRequestException('Failed to add expense');
    }
  }

  /**
   * updateExpense — partially updates an expense by ID.
   * The `where: { id, userId }` compound filter ensures a user cannot update
   * another user's expense even if they guess the UUID.
   */
  async updateExpense(userId: string, expenseId: string, data: any) {
    try {
      const expense = await this.prisma.expense.update({
        where: { id: expenseId, userId }, // ownership check via compound where
        data,
      });
      return { success: true, expense };
    } catch (error) {
      throw new BadRequestException('Failed to update expense');
    }
  }

  /**
   * deleteExpense — hard-deletes an expense record.
   * The compound `where` clause prevents unauthorized deletion.
   */
  async deleteExpense(userId: string, expenseId: string) {
    try {
      await this.prisma.expense.delete({
        where: { id: expenseId, userId },
      });
      return { success: true };
    } catch (error) {
      throw new BadRequestException('Failed to delete expense');
    }
  }
}
