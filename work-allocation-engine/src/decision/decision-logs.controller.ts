import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DecisionLogsService } from './decision-logs.service';
import { CreateDecisionLogDto } from './dto/create-decision-log.dto';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth/supabase-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('decisions')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class DecisionLogsController {
  constructor(private readonly decisionLogsService: DecisionLogsService) {}

  /**
   * Log an allocation, proposal, or release decision (internal use).
   */
  @Roles('ADMIN', 'MANAGER')
  @Post()
  async createDecisionLog(@Body() dto: CreateDecisionLogDto) {
    return this.decisionLogsService.createDecisionLog(dto);
  }

  /**
   * Get chronological decision history for an entity.
   * Allowed roles: ADMIN, MANAGER, EMPLOYEE (employees can only view decisions concerning themselves).
   */
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @Get('history/:entityType/:entityId')
  async getDecisionHistory(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
    @CurrentUser() user?: any,
  ) {
    return this.decisionLogsService.getDecisionHistory(
      entityId,
      entityType,
      user,
    );
  }

  /**
   * Get full audit trail of all allocation lifecycle events for a project.
   */
  @Roles('ADMIN', 'MANAGER')
  @Get('audit/:projectId')
  async getAuditTrail(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
  ) {
    return this.decisionLogsService.getAuditTrail(projectId);
  }

  /**
   * Export structured audit log JSON for an individual decision record.
   */
  @Roles('ADMIN', 'MANAGER')
  @Get(':decisionLogId/export')
  async exportDecisionLog(
    @Param('decisionLogId', new ParseUUIDPipe()) decisionLogId: string,
  ) {
    return this.decisionLogsService.exportDecisionLog(decisionLogId);
  }
}
