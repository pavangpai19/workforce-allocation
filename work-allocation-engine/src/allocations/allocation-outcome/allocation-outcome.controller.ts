import {
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AllocationOutcomeService } from './allocation-outcome.service';

import { SupabaseAuthGuard } from '../../auth/guards/supabase-auth/supabase-auth.guard';
import { RolesGuard } from '../../auth/guards/roles/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('allocations')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class AllocationOutcomeController {
  constructor(
    private readonly outcomeService: AllocationOutcomeService,
  ) {}

  @Roles('ADMIN', 'MANAGER')
  @Post('outcome')
  async outcome(
    @Body() body: any,
  ) {
    return this.outcomeService.recordOutcome(
      body.allocation_id,
      body.delivery_score,
      body.quality_score,
      body.completion_status,
    );
  }
}