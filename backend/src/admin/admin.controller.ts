import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';

@ApiTags('Admin Dashboard')
@Controller('admin')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'National dashboard statistics' })
  getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('revenue/:period')
  @ApiOperation({ summary: 'Revenue report by period (daily/weekly/monthly)' })
  getRevenue(@Param('period') period: string) {
    return this.adminService.getRevenueReport(period);
  }

  @Get('national-overview')
  @ApiOperation({ summary: 'National health system overview with alerts' })
  getNationalOverview() {
    return this.adminService.getNationalOverview();
  }

  @Get('service-demand')
  @ApiOperation({ summary: 'Service demand trends' })
  getServiceDemand() {
    return this.adminService.getServiceDemand();
  }
}
