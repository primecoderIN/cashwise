import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getSummary(req: any): Promise<{
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
    getCharts(req: any): Promise<{
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
    getRecent(req: any): Promise<({
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
