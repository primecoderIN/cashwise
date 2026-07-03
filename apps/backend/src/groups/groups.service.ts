import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async getGroups(userId: string) {
    return this.prisma.expenseGroup.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createGroup(userId: string, data: { name: string; description?: string }) {
    try {
      const group = await this.prisma.expenseGroup.create({
        data: {
          ...data,
          userId,
        },
      });
      return { success: true, group };
    } catch (error) {
      throw new BadRequestException('Failed to create group');
    }
  }

  async deleteGroup(userId: string, groupId: string) {
    try {
      await this.prisma.expenseGroup.delete({
        where: {
          id: groupId,
          userId,
        },
      });
      return { success: true };
    } catch (error) {
      throw new BadRequestException('Failed to delete group');
    }
  }
}
