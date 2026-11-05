import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AllocationRiskService } from './allocation-risk.service';

import { SupabaseAuthGuard } from '../../auth/guards/supabase-auth/supabase-auth.guard';
import { RolesGuard } from '../../auth/guards/roles/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('allocations')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class AllocationRiskController {
  constructor(
    private readonly riskService: AllocationRiskService,
  ) {}

  @Roles('ADMIN', 'MANAGER')
  @Get('risk')
  async risk(
    @Query('week_start_date')
    week_start_date: string,
  ) {
    return this.riskService.analyzeRisk(
      week_start_date,
    );
  }
}