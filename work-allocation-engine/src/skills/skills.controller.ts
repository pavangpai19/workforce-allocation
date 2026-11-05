import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';

import { SkillsService } from './skills.service';

import { SupabaseAuthGuard } from '../auth/guards/supabase-auth/supabase-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('skills')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class SkillsController {
  constructor(
    private readonly skillsService: SkillsService,
  ) {}

  @Roles('ADMIN', 'MANAGER')
  @Get()
  async findAll() {
    return this.skillsService.findAll();
  }

  @Roles('ADMIN', 'MANAGER')
  @Post()
  async create(
    @Body()
    body: any,
  ) {
    return this.skillsService.create(body);
  }

  @Roles('ADMIN', 'MANAGER')
  @Post('assign')
  async assignSkill(
    @Body()
    body: any,
  ) {
    return this.skillsService.assignSkillToEmployee(body);
  }
}