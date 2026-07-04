import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    getCategories(req: any): Promise<{
        id: string;
        name: string;
        color: string;
        icon: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
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
            color: string;
            icon: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    deleteCategory(req: any, id: string): Promise<{
        success: boolean;
    }>;
}
