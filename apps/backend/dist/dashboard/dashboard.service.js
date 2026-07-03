"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSummary(userId) {
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
        let highestGroupData = null;
        if (highestGroup.length > 0 && highestGroup[0].groupId) {
            highestGroupData = await this.prisma.expenseGroup.findUnique({
                where: { id: highestGroup[0].groupId },
                select: { id: true, name: true }
            });
        }
        let highestCategoryData = null;
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
    async getCharts(userId) {
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
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentExpenses = await this.prisma.expense.findMany({
            where: { userId, date: { gte: thirtyDaysAgo } },
            orderBy: { date: 'asc' },
        });
        const trendMap = new Map();
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
    async getRecent(userId) {
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
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map