import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('api/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get dashboard summary cards' })
  getSummary(@Req() req: any) {
    return this.dashboardService.getSummary(req.user.id);
  }

  @Get('charts')
  @ApiOperation({ summary: 'Get dashboard charts data' })
  getCharts(@Req() req: any) {
    return this.dashboardService.getCharts(req.user.id);
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent expenses' })
  getRecent(@Req() req: any) {
    return this.dashboardService.getRecent(req.user.id);
  }
}
