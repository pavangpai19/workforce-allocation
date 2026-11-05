import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';

import { HiringSignalService } from './hiring-signal.service';

import { SupabaseAuthGuard } from '../../auth/guards/supabase-auth/supabase-auth.guard';
import { RolesGuard } from '../../auth/guards/roles/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('allocations')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class HiringSignalController {
  constructor(
    private readonly service: HiringSignalService,
  ) {}

  @Roles('ADMIN', 'MANAGER')
  @Get('hiring-signal')
  async signal(
    @Query('week_start_date')
    week_start_date: string,
  ) {
    return this.service.analyze(
      week_start_date,
    );
  }
}