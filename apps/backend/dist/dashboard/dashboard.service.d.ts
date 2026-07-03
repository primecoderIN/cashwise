import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getSummary(userId: string): Promise<{
        totalAmount: number;
        monthlyAmount: number;
        highestGroup: {
            amount: number | null;
            id: string;
            name: string;
        } | null;
        highestCategory: {
            amount: number | null;
            id: string;
            name: string;
            color: string;
            icon: string;
        } | null;
    }>;
    getCharts(userId: string): Promise<{
        byGroup: {
            name: string;
            value: number;
        }[];
        byCategory: {
            name: string;
            value: number;
            color: string;
        }[];
        trend: {
            date: string;
            amount: number;
        }[];
    }>;
    getRecent(userId: string): Promise<({
        category: {
            id: string;
            name: string;
            color: string;
            icon: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
        };
        group: {
            id: string;
            name: string;
            color: string;
            icon: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
        } | null;
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        amount: number;
        date: Date;
        notes: string | null;
        categoryId: string;
        groupId: string | null;
    })[]>;
}
