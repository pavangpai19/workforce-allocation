import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReleaseService } from './release.service';
import { ReportWorkCompletionDto } from './dto/report-work-completion.dto';
import { ConfirmReleaseDto, ReviewCompletionDto } from './dto/confirm-release.dto';
import { SupabaseAuthGuard } from '../../auth/guards/supabase-auth/supabase-auth.guard';
import { RolesGuard } from '../../auth/guards/roles/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@Controller('release')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class ReleaseController {
  constructor(private readonly releaseService: ReleaseService) {}

  /**
   * Report work completion for an allocation.
   * Allowed roles: ADMIN, MANAGER, EMPLOYEE.
   */
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @Post(':allocationId/complete')
  async reportWorkCompletion(
    @Param('allocationId', new ParseUUIDPipe()) allocationId: string,
    @Body() dto: ReportWorkCompletionDto,
    @CurrentUser() user?: any,
  ) {
    const employeeId = dto?.employee_id || user?.employeeId || user?.employee_id;
    return this.releaseService.reportWorkCompletion(allocationId, employeeId, dto);
  }

  /**
   * Manager review of completed work.
   * Allowed roles: ADMIN, MANAGER.
   */
  @Roles('ADMIN', 'MANAGER')
  @Post(':allocationId/review')
  async reviewCompletion(
    @Param('allocationId', new ParseUUIDPipe()) allocationId: string,
    @Body() dto: ReviewCompletionDto,
    @CurrentUser() user?: any,
  ) {
    const managerId = dto?.manager_id || user?.employeeId || user?.employee_id;
    return this.releaseService.reviewCompletion(allocationId, managerId, dto);
  }

  /**
   * Confirm release of an allocation and restore employee capacity.
   * Allowed roles: ADMIN, MANAGER.
   */
  @Roles('ADMIN', 'MANAGER')
  @Post(':allocationId/confirm')
  async confirmRelease(
    @Param('allocationId', new ParseUUIDPipe()) allocationId: string,
    @Body() dto: ConfirmReleaseDto,
    @CurrentUser() user?: any,
  ) {
    const managerId = dto?.manager_id || user?.employeeId || user?.employee_id;
    return this.releaseService.confirmRelease(allocationId, managerId, dto);
  }

  /**
   * Get all releasable allocations for a project.
   * Allowed roles: ADMIN, MANAGER.
   */
  @Roles('ADMIN', 'MANAGER')
  @Get('project/:projectId/releasable')
  async getReleasableAllocations(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
  ) {
    return this.releaseService.getReleasableAllocations(projectId);
  }
}
