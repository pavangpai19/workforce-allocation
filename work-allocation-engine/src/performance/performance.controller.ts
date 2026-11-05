import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { PerformanceService } from './performance.service';

import { SupabaseAuthGuard } from '../auth/guards/supabase-auth/supabase-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('performance')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class PerformanceController {
  constructor(
    private readonly perfService: PerformanceService,
  ) {}

  @Roles('ADMIN', 'MANAGER')
  @Post()
  async record(
    @Body() body: any,
  ) {
    return this.perfService.recordPerformance(body);
  }

  @Roles('ADMIN', 'MANAGER')
  @Get('score')
  async getScore(
    @Query('employee_id')
    employee_id: string,
  ) {
    return this.perfService.getEmployeeScore(
      employee_id,
    );
  }
}