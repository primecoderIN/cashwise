import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * GroupsService — manages expense groups per user.
 * Groups are user-defined buckets (e.g. "Trip to Paris", "Monthly Bills")
 * that allow grouping related expenses together for reporting.
 * Each group has a name, optional description, an icon, and a color.
 */
@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  /**
   * getGroups — returns all groups for the user, newest first.
   */
  async getGroups(userId: string) {
    return this.prisma.expenseGroup.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * createGroup — creates a new expense group.
   * `icon` and `color` default to sensible values if not provided by the client.
   * Schema enforces unique (name, userId) — duplicate names return a 400.
   */
  async createGroup(
    userId: string,
    data: { name: string; description?: string; icon?: string; color?: string },
  ) {
    try {
      const group = await this.prisma.expenseGroup.create({
        data: {
          name: data.name,
          description: data.description,
          icon: data.icon ?? 'folder',       // default icon key
          color: data.color ?? '#16a34a',    // default to brand green
          userId,
        },
      });
      return { success: true, group };
    } catch (error) {
      throw new BadRequestException('Failed to create group');
    }
  }

  /**
   * deleteGroup — removes a group by ID.
   * If any expenses reference this group (via groupId FK), Prisma will throw.
   * Expenses must be unlinked or reassigned before the group can be deleted.
   */
  async deleteGroup(userId: string, groupId: string) {
    try {
      await this.prisma.expenseGroup.delete({
        where: { id: groupId, userId },
      });
      return { success: true };
    } catch (error) {
      throw new BadRequestException('Failed to delete group');
    }
  }
}
