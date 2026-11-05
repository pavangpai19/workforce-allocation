import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AllocationsService } from './allocations.service';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth/supabase-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser as CurrentUserDecorator } from '../auth/decorators/current-user.decorator';
import type { CurrentUser } from '../auth/interfaces/current-user.interface';

/**
 * Standard allocations controller for CRUD operations on committed allocations.
 * Note: Automated single-skill allocation has been consolidated canonically in AutoAllocationController.
 */
@Controller('allocations')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class AllocationsController {
  constructor(
    private readonly allocationsService: AllocationsService,
  ) {}

  @Roles('ADMIN', 'MANAGER')
  @Get()
  async findAll() {
    return this.allocationsService.findAll();
  }

  @Roles('ADMIN', 'MANAGER')
  @Post()
  async create(
    @Body() body: any,
  ) {
    return this.allocationsService.create(body);
  }

  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @Get('my')
  async findMyAllocations(@CurrentUserDecorator() user: CurrentUser) {
    const empId = user.employeeId || (user as any).employee_id;
    return this.allocationsService.findByEmployee(empId);
  }
}
