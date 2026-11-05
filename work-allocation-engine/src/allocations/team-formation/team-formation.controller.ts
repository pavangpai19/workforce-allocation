import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TeamFormationService } from './team-formation.service';
import { GenerateTeamProposalDto } from './dto/generate-team-proposal.dto';
import { SupabaseAuthGuard } from '../../auth/guards/supabase-auth/supabase-auth.guard';
import { RolesGuard } from '../../auth/guards/roles/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('team-formation')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class TeamFormationController {
  constructor(private readonly teamFormationService: TeamFormationService) {}

  @Roles('ADMIN', 'MANAGER')
  @Post('generate')
  async generateProposal(@Body() dto: GenerateTeamProposalDto) {
    const result = await this.teamFormationService.generateTeamProposal(
      dto.project_id,
      dto.max_candidates_per_role ?? 5,
      dto.include_fairness_adjustment ?? true,
    );

    return {
      proposal_id: result.proposalId,
      project_id: dto.project_id,
      status: 'PENDING_APPROVAL',
      proposed_members: result.proposedMembers,
      requested_team_size: result.requestedTeamSize,
      selected_headcount: result.selectedHeadcount,
      staffing_gap_summary: result.staffingGapSummary,
      explanation: result.explanation,
    };
  }

  @Roles('ADMIN', 'MANAGER')
  @Get('proposal/:proposalId')
  async getProposal(
    @Param('proposalId', new ParseUUIDPipe()) proposalId: string,
  ) {
    return this.teamFormationService.getProposal(proposalId);
  }
}
