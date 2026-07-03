import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(userId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const [totalExpenses, monthlyExpenses, highestGroup, highestCategory] = await Promise.all([
      this.prisma.expense.aggregate({
        where: { userId },
        _sum: { amount: true },
      }),
      this.prisma.expense.aggregate({
        where: { userId, date: { gte: startOfMonth, lte: endOfMonth } },
        _sum: { amount: true },
      }),
      this.prisma.expense.groupBy({
        by: ['groupId'],
        where: { userId, groupId: { not: null } },
        _sum: { amount: true },
        orderBy: { _sum: { amount: 'desc' } },
        take: 1,
      }),
      this.prisma.expense.groupBy({
        by: ['categoryId'],
        where: { userId },
        _sum: { amount: true },
        orderBy: { _sum: { amount: 'desc' } },
        take: 1,
      }),
    ]);

    let highestGroupData: { id: string; name: string } | null = null;
    if (highestGroup.length > 0 && highestGroup[0].groupId) {
      highestGroupData = await this.prisma.expenseGroup.findUnique({
        where: { id: highestGroup[0].groupId },
        select: { id: true, name: true }
      });
    }

    let highestCategoryData: { id: string; name: string; color: string; icon: string } | null = null;
    if (highestCategory.length > 0 && highestCategory[0].categoryId) {
      highestCategoryData = await this.prisma.category.findUnique({
        where: { id: highestCategory[0].categoryId },
        select: { id: true, name: true, color: true, icon: true }
      });
    }

    return {
      totalAmount: totalExpenses._sum.amount || 0,
      monthlyAmount: monthlyExpenses._sum.amount || 0,
      highestGroup: highestGroupData ? { ...highestGroupData, amount: highestGroup[0]._sum.amount } : null,
      highestCategory: highestCategoryData ? { ...highestCategoryData, amount: highestCategory[0]._sum.amount } : null,
    };
  }

  async getCharts(userId: string) {
    // Expense by Group
    const byGroup = await this.prisma.expense.groupBy({
      by: ['groupId'],
      where: { userId, groupId: { not: null } },
      _sum: { amount: true },
    });
    const groups = await this.prisma.expenseGroup.findMany({ where: { userId } });
    const groupData = byGroup.map(g => ({
      name: groups.find(grp => grp.id === g.groupId)?.name || 'Unknown',
      value: g._sum.amount || 0,
    }));

    // Expense by Category
    const byCategory = await this.prisma.expense.groupBy({
      by: ['categoryId'],
      where: { userId },
      _sum: { amount: true },
    });
    const categories = await this.prisma.category.findMany({ where: { userId } });
    const categoryData = byCategory.map(c => {
      const cat = categories.find(cat => cat.id === c.categoryId);
      return {
        name: cat?.name || 'Unknown',
        value: c._sum.amount || 0,
        color: cat?.color || '#cbd5e1'
      };
    });

    // Trend (Last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentExpenses = await this.prisma.expense.findMany({
      where: { userId, date: { gte: thirtyDaysAgo } },
      orderBy: { date: 'asc' },
    });
    
    // Group by day string
    const trendMap = new Map<string, number>();
    recentExpenses.forEach(exp => {
      const dateStr = exp.date.toISOString().split('T')[0];
      trendMap.set(dateStr, (trendMap.get(dateStr) || 0) + exp.amount);
    });
    
    const trendData = Array.from(trendMap.entries()).map(([date, amount]) => ({ date, amount }));

    return {
      byGroup: groupData,
      byCategory: categoryData,
      trend: trendData
    };
  }

  async getRecent(userId: string) {
    return this.prisma.expense.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 5,
      include: {
        category: true,
        group: true,
      }
    });
  }
}
