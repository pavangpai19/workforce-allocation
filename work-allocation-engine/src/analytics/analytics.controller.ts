import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import {
  AllocationTrendsFilterDto,
  DashboardMetricsFilterDto,
} from './dto/dashboard-metrics.dto';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth/supabase-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('analytics')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * Organization-wide dashboard summary metrics.
   */
  @Roles('ADMIN', 'MANAGER')
  @Get('dashboard')
  async getDashboardMetrics(@Query() filter: DashboardMetricsFilterDto) {
    return this.analyticsService.getDashboardMetrics(filter?.manager_id);
  }

  /**
   * Project-specific staffing coverage and team performance analytics.
   */
  @Roles('ADMIN', 'MANAGER')
  @Get('project/:projectId')
  async getProjectAnalytics(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
  ) {
    return this.analyticsService.getProjectAnalytics(projectId);
  }

  /**
   * Individual employee workload breakdown and capacity utilization.
   * Allowed roles: ADMIN, MANAGER, EMPLOYEE (employees can only view their own workload).
   */
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @Get('employee/:employeeId/workload')
  async getEmployeeWorkload(
    @Param('employeeId', new ParseUUIDPipe()) employeeId: string,
    @CurrentUser() user?: any,
  ) {
    return this.analyticsService.getEmployeeWorkload(employeeId, user);
  }

  /**
   * Historical allocation trends, completions, and releases.
   */
  @Roles('ADMIN', 'MANAGER')
  @Get('trends')
  async getAllocationTrends(@Query() filter: AllocationTrendsFilterDto) {
    return this.analyticsService.getAllocationTrends(filter);
  }

  /**
   * Organization-wide skill demand ranking and deficit analysis.
   */
  @Roles('ADMIN', 'MANAGER')
  @Get('skills/demand')
  async getSkillDemandAnalysis() {
    return this.analyticsService.getSkillDemandAnalysis();
  }

  /**
   * System-level decision metrics.
   */
  @Roles('ADMIN', 'MANAGER')
  @Get('system')
  async getSystemMetrics() {
    return this.analyticsService.getSystemMetrics();
  }

  /**
   * Aggregated performance and risk per employee.
   */
  @Roles('ADMIN', 'MANAGER')
  @Get('employees')
  async getEmployeeMetrics() {
    return this.analyticsService.getEmployeeMetrics();
  }
}