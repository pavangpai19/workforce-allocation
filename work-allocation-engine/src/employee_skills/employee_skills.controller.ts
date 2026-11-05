import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { EmployeeSkillsService } from './employee_skills.service';

import { SupabaseAuthGuard } from '../auth/guards/supabase-auth/supabase-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('employee-skills')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class EmployeeSkillsController {
  constructor(
    private readonly employeeSkillsService: EmployeeSkillsService,
  ) {}

  @Roles('ADMIN', 'MANAGER')
  @Post('assign')
  assign(
    @Body() body: any,
  ) {
    return this.employeeSkillsService.assign(body);
  }

  @Roles('ADMIN', 'MANAGER')
  @Patch('proficiency')
  update(
    @Body() body: any,
  ) {
    return this.employeeSkillsService.update(body);
  }

  @Roles('ADMIN', 'MANAGER')
  @Get(':employeeId')
  findByEmployee(
    @Param('employeeId') employeeId: string,
  ) {
    return this.employeeSkillsService.findByEmployee(
      employeeId,
    );
  }
}