import { PrismaService } from '../prisma/prisma.service';
export declare class GroupsService {
    private prisma;
    constructor(prisma: PrismaService);
    getGroups(userId: string): Promise<{
        id: string;
        name: string;
        color: string;
        icon: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
    }[]>;
    createGroup(userId: string, data: {
        name: string;
        description?: string;
    }): Promise<{
        success: boolean;
        group: {
            id: string;
            name: string;
            color: string;
            icon: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
        };
    }>;
    deleteGroup(userId: string, groupId: string): Promise<{
        success: boolean;
    }>;
}
