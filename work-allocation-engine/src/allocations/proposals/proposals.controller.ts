import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { ApproveProposalDto } from './dto/approve-proposal.dto';
import { RejectProposalDto } from './dto/reject-proposal.dto';
import { CreateProposalPersistenceDto } from './dto/create-proposal-persistence.dto';
import { SupabaseAuthGuard } from '../../auth/guards/supabase-auth/supabase-auth.guard';
import { RolesGuard } from '../../auth/guards/roles/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@Controller('allocation-proposals')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @Get()
  async getAllProposals(@Query('status') status?: string) {
    return this.proposalsService.findAll(status);
  }

  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @Get(':proposalId')
  async getProposal(
    @Param('proposalId', new ParseUUIDPipe()) proposalId: string,
  ) {
    return this.proposalsService.findById(proposalId);
  }

  @Roles('ADMIN', 'MANAGER')
  @Post()
  async createProposal(
    @Body() dto: CreateProposalPersistenceDto,
  ) {
    return this.proposalsService.createProposal(dto);
  }

  @Roles('ADMIN', 'MANAGER')
  @Post(':proposalId/approve')
  async approveProposal(
    @Param('proposalId', new ParseUUIDPipe()) proposalId: string,
    @Body() dto: ApproveProposalDto,
    @CurrentUser() user?: any,
  ) {
    // Extract manager employee ID from authenticated user object with fallback to DTO
    const managerId = dto.manager_id || user?.employeeId || user?.employee_id;
    return this.proposalsService.approveProposal(
      proposalId,
      dto,
      managerId,
    );
  }

  @Roles('ADMIN', 'MANAGER')
  @Post(':proposalId/reject')
  async rejectProposal(
    @Param('proposalId', new ParseUUIDPipe()) proposalId: string,
    @Body() dto: RejectProposalDto,
    @CurrentUser() user?: any,
  ) {
    // Extract manager employee ID from authenticated user object with fallback to DTO
    const managerId = dto.manager_id || user?.employeeId || user?.employee_id;
    return this.proposalsService.rejectProposal(
      proposalId,
      dto,
      managerId,
    );
  }
}

@Controller('projects/:projectId/allocation-proposals')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class ProjectProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @Get()
  async getProjectProposals(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
  ) {
    return this.proposalsService.findByProjectId(projectId);
  }
}
