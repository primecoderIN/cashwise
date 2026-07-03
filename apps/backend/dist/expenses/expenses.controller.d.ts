import { ExpensesService } from './expenses.service';
export declare class ExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
    getExpenses(req: any): Promise<({
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
    addExpense(req: any, data: {
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
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            amount: number;
            date: Date;
            notes: string | null;
            categoryId: string;
            groupId: string | null;
        };
    }>;
    updateExpense(req: any, id: string, data: any): Promise<{
        success: boolean;
        expense: {
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
        };
    }>;
    deleteExpense(req: any, id: string): Promise<{
        success: boolean;
    }>;
}
