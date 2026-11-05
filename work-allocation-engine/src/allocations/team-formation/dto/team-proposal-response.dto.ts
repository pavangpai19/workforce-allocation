import {
  IsUUID,
  IsString,
  IsArray,
  ValidateNested,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CandidateScoreBreakdown {
  @IsNumber()
  skill_match_score: number;

  @IsNumber()
  predicted_performance: number;

  @IsNumber()
  fairness_adjustment: number;

  @IsNumber()
  final_score: number;
}

export class ProposedTeamMemberDto {
  @IsUUID()
  employee_id: string;

  @IsString()
  employee_name: string;

  @IsString()
  proposed_role: string;

  @IsUUID()
  staffing_requirement_id: string;

  @ValidateNested()
  @Type(() => CandidateScoreBreakdown)
  score_breakdown: CandidateScoreBreakdown;

  @IsNumber()
  allocated_hours_per_week: number;

  @IsString()
  availability_status: string;

  @IsOptional()
  constraint_snapshot?: Record<string, any>;
}

export class TeamProposalResponseDto {
  @IsUUID()
  proposal_id: string;

  @IsUUID()
  project_id: string;

  @IsString()
  status: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProposedTeamMemberDto)
  proposed_members: ProposedTeamMemberDto[];

  @IsNumber()
  requested_team_size: number;

  @IsNumber()
  selected_headcount: number;

  @IsOptional()
  @IsString()
  staffing_gap_summary?: string;

  @IsOptional()
  @IsString()
  explanation?: string;
}
