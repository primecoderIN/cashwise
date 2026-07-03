import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/groups')
@UseGuards(AuthGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  async getGroups(@Request() req) {
    return this.groupsService.getGroups(req.user.id);
  }

  @Post()
  async createGroup(@Request() req, @Body() data: { name: string; description?: string }) {
    return this.groupsService.createGroup(req.user.id, data);
  }

  @Delete(':id')
  async deleteGroup(@Request() req, @Param('id') id: string) {
    return this.groupsService.deleteGroup(req.user.id, id);
  }
}
