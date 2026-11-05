import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AllocationIntelligenceService } from './allocation-intelligence.service';

import { SupabaseAuthGuard } from '../auth/guards/supabase-auth/supabase-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('allocations')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class AllocationIntelligenceController {
  constructor(
    private readonly intelligenceService: AllocationIntelligenceService,
  ) {}

  @Roles('ADMIN', 'MANAGER')
  @Get('suggestions')
  async suggest(
    @Query('required_hours') required_hours: string,
    @Query('week_start_date') week_start_date: string,
  ) {
    return this.intelligenceService.suggestEmployees(
      Number(required_hours),
      week_start_date,
    );
  }
}