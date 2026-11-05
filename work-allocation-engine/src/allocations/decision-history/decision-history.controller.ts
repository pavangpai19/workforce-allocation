import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';

import { DecisionHistoryService } from './decision-history.service';

import { SupabaseAuthGuard } from '../../auth/guards/supabase-auth/supabase-auth.guard';
import { RolesGuard } from '../../auth/guards/roles/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('allocations/decisions')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class DecisionHistoryController {
  constructor(
    private readonly decisionHistoryService: DecisionHistoryService,
  ) {}

  @Roles('ADMIN', 'MANAGER')
  @Get()
  async getAllDecisions() {
    return this.decisionHistoryService.getAllDecisions();
  }

  @Roles('ADMIN', 'MANAGER')
  @Get(':project_id')
  async getDecisionsByProject(
    @Param('project_id')
    project_id: string,
  ) {
    return this.decisionHistoryService.getDecisionsByProject(
      project_id,
    );
  }
}