import { GroupsService } from './groups.service';
export declare class GroupsController {
    private readonly groupsService;
    constructor(groupsService: GroupsService);
    getGroups(req: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        color: string;
        icon: string;
        userId: string;
        description: string | null;
    }[]>;
    createGroup(req: any, data: {
        name: string;
        description?: string;
        icon?: string;
        color?: string;
    }): Promise<{
        success: boolean;
        group: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            color: string;
            icon: string;
            userId: string;
            description: string | null;
        };
    }>;
    deleteGroup(req: any, id: string): Promise<{
        success: boolean;
    }>;
}
