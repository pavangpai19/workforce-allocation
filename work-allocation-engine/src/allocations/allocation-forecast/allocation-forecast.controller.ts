import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AllocationForecastService } from './allocation-forecast.service';

import { SupabaseAuthGuard } from '../../auth/guards/supabase-auth/supabase-auth.guard';
import { RolesGuard } from '../../auth/guards/roles/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('allocations')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class AllocationForecastController {
  constructor(
    private readonly forecastService: AllocationForecastService,
  ) {}

  @Roles('ADMIN', 'MANAGER')
  @Get('forecast')
  async forecast(
    @Query('week_start_date')
    week_start_date: string,
  ) {
    return this.forecastService.forecastNextWeek(
      week_start_date,
    );
  }
}