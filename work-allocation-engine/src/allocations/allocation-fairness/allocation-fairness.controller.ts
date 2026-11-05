import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AllocationFairnessService } from './allocation-fairness.service';

import { SupabaseAuthGuard } from '../../auth/guards/supabase-auth/supabase-auth.guard';
import { RolesGuard } from '../../auth/guards/roles/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('allocations')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class AllocationFairnessController {
  constructor(
    private readonly fairnessService: AllocationFairnessService,
  ) {}

  @Roles('ADMIN', 'MANAGER')
  @Get('suggestions/fair')
  async fairSuggestions(
    @Query('required_hours') required_hours: string,
    @Query('week_start_date') week_start_date: string,
  ) {
    return this.fairnessService.getFairSuggestions(
      Number(required_hours),
      week_start_date,
    );
  }
}