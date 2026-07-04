import { PrismaService } from '../prisma/prisma.service';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    getCategories(userId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        color: string;
        icon: string;
        userId: string;
    }[]>;
    createCategory(userId: string, data: {
        name: string;
        color: string;
        icon: string;
    }): Promise<{
        success: boolean;
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            color: string;
            icon: string;
            userId: string;
        };
    }>;
    deleteCategory(userId: string, categoryId: string): Promise<{
        success: boolean;
    }>;
}
