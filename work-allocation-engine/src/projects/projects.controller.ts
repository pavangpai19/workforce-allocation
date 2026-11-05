import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ProjectsService } from './projects.service';

import { SupabaseAuthGuard } from '../auth/guards/supabase-auth/supabase-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('projects')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
  ) {}

  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @Get()
  async findAll() {
    return this.projectsService.findAll();
  }

  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.projectsService.findById(id);
  }

  @Roles('ADMIN', 'MANAGER')
  @Post()
  async create(
    @Body()
    body: any,
  ) {
    return this.projectsService.create(body);
  }
}
