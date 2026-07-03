import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/expenses')
@UseGuards(AuthGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  async getExpenses(@Request() req) {
    return this.expensesService.getExpenses(req.user.id);
  }

  @Post()
  async addExpense(@Request() req, @Body() data: { title: string; amount: number; date: Date; categoryId: string; groupId?: string; notes?: string }) {
    return this.expensesService.addExpense(req.user.id, data);
  }

  @Put(':id')
  async updateExpense(@Request() req, @Param('id') id: string, @Body() data: any) {
    return this.expensesService.updateExpense(req.user.id, id, data);
  }

  @Delete(':id')
  async deleteExpense(@Request() req, @Param('id') id: string) {
    return this.expensesService.deleteExpense(req.user.id, id);
  }
}
