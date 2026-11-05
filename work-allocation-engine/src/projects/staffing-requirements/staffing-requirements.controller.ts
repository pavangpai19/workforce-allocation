import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { StaffingRequirementsService } from './staffing-requirements.service';
import { CreateStaffingRequirementDto } from './dto/create-staffing-requirement.dto';
import { UpdateStaffingRequirementDto } from './dto/update-staffing-requirement.dto';
import { SupabaseAuthGuard } from '../../auth/guards/supabase-auth/supabase-auth.guard';
import { RolesGuard } from '../../auth/guards/roles/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('projects/:projectId/staffing-requirements')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class StaffingRequirementsController {
  constructor(
    private readonly staffingService: StaffingRequirementsService,
  ) {}

  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @Get()
  async getStaffingRequirements(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
  ) {
    return this.staffingService.findByProjectId(projectId);
  }

  @Roles('ADMIN', 'MANAGER')
  @Post()
  async createStaffingRequirement(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Body() dto: CreateStaffingRequirementDto,
  ) {
    return this.staffingService.create(projectId, dto);
  }

  @Roles('ADMIN', 'MANAGER')
  @Patch(':requirementId')
  async updateStaffingRequirement(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Param('requirementId', new ParseUUIDPipe()) requirementId: string,
    @Body() dto: UpdateStaffingRequirementDto,
  ) {
    return this.staffingService.update(projectId, requirementId, dto);
  }

  @Roles('ADMIN', 'MANAGER')
  @Delete(':requirementId')
  async deleteStaffingRequirement(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Param('requirementId', new ParseUUIDPipe()) requirementId: string,
  ) {
    return this.staffingService.delete(projectId, requirementId);
  }
}
