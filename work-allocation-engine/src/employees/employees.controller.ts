import {
  Body,
  Controller,
  Get,
  Param,
  ForbiddenException,
  Post,
  UseGuards,
} from '@nestjs/common';

import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';

import { SupabaseAuthGuard } from '../auth/guards/supabase-auth/supabase-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser as CurrentUserDecorator } from '../auth/decorators/current-user.decorator';
import type { CurrentUser } from '../auth/interfaces/current-user.interface';

@Controller('employees')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class EmployeesController {
  constructor(
    private readonly employeesService: EmployeesService,
  ) {}

  @Roles('ADMIN', 'MANAGER')
  @Get()
  async findAll() {
    return this.employeesService.findAll();
  }

  @Roles('ADMIN', 'MANAGER')
  @Post()
  async create(
    @Body()
    body: CreateEmployeeDto,
  ) {
    return this.employeesService.create(body);
  }

  @Roles('ADMIN', 'MANAGER')
  @Get('workload')
  async getWorkload() {
    return this.employeesService.getWeeklyWorkload();
  }

  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUserDecorator() user: CurrentUser) {
    if (user.role === 'EMPLOYEE' && user.employeeId !== id) {
      throw new ForbiddenException('Employees can only access their own profile');
    }
    return this.employeesService.findById(id);
  }
}