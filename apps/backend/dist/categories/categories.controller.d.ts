import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    getCategories(req: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        color: string;
        icon: string;
        userId: string;
    }[]>;
    createCategory(req: any, data: {
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
    deleteCategory(req: any, id: string): Promise<{
        success: boolean;
    }>;
}
