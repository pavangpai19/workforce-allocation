import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AlertFilterDto, DismissAlertDto } from './dto/create-alert.dto';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth/supabase-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('alerts')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  /**
   * Get paginated alerts with query filters.
   */
  @Roles('ADMIN', 'MANAGER')
  @Get()
  async getAlerts(@Query() filters: AlertFilterDto) {
    return this.alertsService.getAlerts(filters);
  }

  /**
   * Run capacity check for a specific employee.
   */
  @Roles('ADMIN', 'MANAGER')
  @Post('capacity/:employeeId/check')
  async checkCapacityAlerts(
    @Param('employeeId', new ParseUUIDPipe()) employeeId: string,
  ) {
    return this.alertsService.checkCapacityAlerts(employeeId);
  }

  /**
   * Run staffing gap check for a specific project.
   */
  @Roles('ADMIN', 'MANAGER')
  @Post('staffing/:projectId/check')
  async checkStaffingGapAlerts(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
  ) {
    return this.alertsService.checkStaffingGapAlerts(projectId);
  }

  /**
   * Trigger organization-wide hiring signal aggregation.
   */
  @Roles('ADMIN', 'MANAGER')
  @Post('hiring/check')
  async checkHiringSignals() {
    return this.alertsService.checkHiringSignals();
  }

  /**
   * Get single alert by ID.
   */
  @Roles('ADMIN', 'MANAGER')
  @Get(':alertId')
  async getAlertById(
    @Param('alertId', new ParseUUIDPipe()) alertId: string,
  ) {
    return this.alertsService.getAlertById(alertId);
  }

  /**
   * Dismiss an active alert with manager review comment.
   */
  @Roles('ADMIN', 'MANAGER')
  @Post(':alertId/dismiss')
  async dismissAlert(
    @Param('alertId', new ParseUUIDPipe()) alertId: string,
    @Body() dto: DismissAlertDto,
    @CurrentUser() user?: any,
  ) {
    const managerId = dto?.manager_id || user?.employeeId || user?.employee_id;
    return this.alertsService.dismissAlert(alertId, managerId, dto?.reason);
  }
}
