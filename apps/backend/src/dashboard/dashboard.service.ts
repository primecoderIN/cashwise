import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * DashboardService — aggregates data for the dashboard overview screen.
 *
 * All methods accept a `userId` (DB UUID) to ensure strict data isolation —
 * users can only ever see their own expenses.
 */
@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * getSummary — returns the four top-level stat cards:
   *   - totalAmount:      all-time sum of expenses
   *   - monthlyAmount:    sum for the current calendar month
   *   - highestGroup:     the expense group with the largest total spend
   *   - highestCategory:  the category with the largest total spend
   */
  async getSummary(userId: string) {
    const now = new Date();
    // Calculate the first and last moment of the current month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // Run all four aggregation queries in parallel for efficiency
    const [totalExpenses, monthlyExpenses, highestGroup, highestCategory] = await Promise.all([
      // Sum of ALL expenses ever recorded for this user
      this.prisma.expense.aggregate({
        where: { userId },
        _sum: { amount: true },
      }),

      // Sum of expenses within the current calendar month
      this.prisma.expense.aggregate({
        where: { userId, date: { gte: startOfMonth, lte: endOfMonth } },
        _sum: { amount: true },
      }),

      // Group expenses by group, order descending, take the top 1
      this.prisma.expense.groupBy({
        by: ['groupId'],
        where: { userId, groupId: { not: null } }, // only grouped expenses
        _sum: { amount: true },
        orderBy: { _sum: { amount: 'desc' } },
        take: 1,
      }),

      // Group expenses by category, order descending, take the top 1
      this.prisma.expense.groupBy({
        by: ['categoryId'],
        where: { userId },
        _sum: { amount: true },
        orderBy: { _sum: { amount: 'desc' } },
        take: 1,
      }),
    ]);

    // Resolve the top group name (groupBy only returns IDs)
    let highestGroupData: { id: string; name: string } | null = null;
    if (highestGroup.length > 0 && highestGroup[0].groupId) {
      highestGroupData = await this.prisma.expenseGroup.findUnique({
        where: { id: highestGroup[0].groupId },
        select: { id: true, name: true },
      });
    }

    // Resolve the top category name and styling
    let highestCategoryData: { id: string; name: string; color: string; icon: string } | null = null;
    if (highestCategory.length > 0 && highestCategory[0].categoryId) {
      highestCategoryData = await this.prisma.category.findUnique({
        where: { id: highestCategory[0].categoryId },
        select: { id: true, name: true, color: true, icon: true },
      });
    }

    return {
      totalAmount: totalExpenses._sum.amount || 0,
      monthlyAmount: monthlyExpenses._sum.amount || 0,
      highestGroup: highestGroupData
        ? { ...highestGroupData, amount: highestGroup[0]._sum.amount }
        : null,
      highestCategory: highestCategoryData
        ? { ...highestCategoryData, amount: highestCategory[0]._sum.amount }
        : null,
    };
  }

  /**
   * getCharts — returns data for the three dashboard charts:
   *   - byGroup:    total spend per expense group (donut chart)
   *   - byCategory: total spend per category with color (donut chart)
   *   - trend:      daily spend totals for the last 30 days (line chart)
   */
  async getCharts(userId: string) {
    // ── Expenses by Group ────────────────────────────────────────────────────
    const byGroup = await this.prisma.expense.groupBy({
      by: ['groupId'],
      where: { userId, groupId: { not: null } },
      _sum: { amount: true },
    });
    // Fetch all group names so we can label the chart slices
    const groups = await this.prisma.expenseGroup.findMany({ where: { userId } });
    const groupData = byGroup.map((g) => ({
      name: groups.find((grp) => grp.id === g.groupId)?.name || 'Unknown',
      value: g._sum.amount || 0,
    }));

    // ── Expenses by Category ─────────────────────────────────────────────────
    const byCategory = await this.prisma.expense.groupBy({
      by: ['categoryId'],
      where: { userId },
      _sum: { amount: true },
    });
    const categories = await this.prisma.category.findMany({ where: { userId } });
    const categoryData = byCategory.map((c) => {
      const cat = categories.find((cat) => cat.id === c.categoryId);
      return {
        name: cat?.name || 'Unknown',
        value: c._sum.amount || 0,
        color: cat?.color || '#cbd5e1',
      };
    });

    // ── 30-day Trend ─────────────────────────────────────────────────────────
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentExpenses = await this.prisma.expense.findMany({
      where: { userId, date: { gte: thirtyDaysAgo } },
      orderBy: { date: 'asc' },
    });

    // Aggregate into daily buckets using a Map keyed by ISO date string
    const trendMap = new Map<string, number>();
    recentExpenses.forEach((exp) => {
      const dateStr = exp.date.toISOString().split('T')[0];
      trendMap.set(dateStr, (trendMap.get(dateStr) || 0) + exp.amount);
    });
    const trendData = Array.from(trendMap.entries()).map(([date, amount]) => ({ date, amount }));

    return {
      byGroup: groupData,
      byCategory: categoryData,
      trend: trendData,
    };
  }

  /**
   * getRecent — returns the 5 most recent expenses with category and group details
   * for the "Recent Expenses" table on the dashboard.
   */
  async getRecent(userId: string) {
    return this.prisma.expense.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 5,
      include: {
        category: true, // joins category name, color, icon
        group: true,    // joins group name (nullable)
      },
    });
  }
}
