import { PrismaService } from '../prisma/prisma.service';
export declare class ExpensesService {
    private prisma;
    constructor(prisma: PrismaService);
    getExpenses(userId: string): Promise<({
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            color: string;
            icon: string;
            userId: string;
        };
        group: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            color: string;
            icon: string;
            userId: string;
            description: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        amount: number;
        date: Date;
        notes: string | null;
        categoryId: string;
        groupId: string | null;
    })[]>;
    addExpense(userId: string, data: {
        title: string;
        amount: number;
        date: Date;
        categoryId: string;
        groupId?: string;
        notes?: string;
    }): Promise<{
        success: boolean;
        expense: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            title: string;
            amount: number;
            date: Date;
            notes: string | null;
            categoryId: string;
            groupId: string | null;
        };
    }>;
    updateExpense(userId: string, expenseId: string, data: any): Promise<{
        success: boolean;
        expense: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            title: string;
            amount: number;
            date: Date;
            notes: string | null;
            categoryId: string;
            groupId: string | null;
        };
    }>;
    deleteExpense(userId: string, expenseId: string): Promise<{
        success: boolean;
    }>;
}
