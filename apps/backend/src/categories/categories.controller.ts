import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/categories')
@UseGuards(AuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getCategories(@Request() req) {
    return this.categoriesService.getCategories(req.user.id);
  }

  @Post()
  async createCategory(@Request() req, @Body() data: { name: string; color: string; icon: string }) {
    return this.categoriesService.createCategory(req.user.id, data);
  }

  @Delete(':id')
  async deleteCategory(@Request() req, @Param('id') id: string) {
    return this.categoriesService.deleteCategory(req.user.id, id);
  }
}
