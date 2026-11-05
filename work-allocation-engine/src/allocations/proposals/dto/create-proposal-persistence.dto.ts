import {
  IsUUID,
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsPositive,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ProposalStatus {
  DRAFT = 'DRAFT',
  GENERATING = 'GENERATING',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PARTIALLY_COMMITTED = 'PARTIALLY_COMMITTED',
  EXPIRED = 'EXPIRED',
  FAILED = 'FAILED',
}

export enum ProposalAvailabilityStatus {
  AVAILABLE_NOW = 'AVAILABLE_NOW',
  AVAILABLE_AFTER_RELEASE_CONFIRMATION = 'AVAILABLE_AFTER_RELEASE_CONFIRMATION',
  ACTIVE_UNFINISHED_WORK = 'ACTIVE_UNFINISHED_WORK',
  UNAVAILABLE = 'UNAVAILABLE',
  ON_LEAVE = 'ON_LEAVE',
  CAPACITY_CONSTRAINED = 'CAPACITY_CONSTRAINED',
}

export class ProposedMemberPersistenceDto {
  @IsUUID()
  employee_id: string;

  @IsUUID()
  staffing_requirement_id: string;

  @IsString()
  proposed_role: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  allocated_hours_per_week?: number = 40;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  allocation_percentage?: number = 100;

  @IsOptional()
  @IsString()
  eligibility_status?: string = 'ELIGIBLE';

  @IsOptional()
  constraint_snapshot?: Record<string, any> = {};

  @IsOptional()
  score_breakdown?: Record<string, any> = {};

  @IsNumber()
  @Min(0)
  @Max(1)
  skill_match_score: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  predicted_performance: number;

  @IsOptional()
  @IsNumber()
  predicted_completion_hours?: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  burnout_risk_probability: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  fairness_adjustment: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  final_score: number;

  @IsOptional()
  @IsEnum(ProposalAvailabilityStatus)
  availability_status?: ProposalAvailabilityStatus = ProposalAvailabilityStatus.AVAILABLE_NOW;

  @IsOptional()
  @IsString()
  explanation?: string;
}

export class CreateProposalPersistenceDto {
  @IsUUID()
  project_id: string;

  @IsOptional()
  @IsUUID()
  requested_by?: string;

  @IsOptional()
  @IsEnum(ProposalStatus)
  status?: ProposalStatus = ProposalStatus.DRAFT;

  @IsInt()
  @IsPositive()
  requested_team_size: number;

  @IsInt()
  @Min(0)
  selected_headcount: number;

  @IsOptional()
  proposal_summary?: Record<string, any>;

  @IsOptional()
  staffing_gap_summary?: Record<string, any>;

  @IsOptional()
  @IsString()
  decision_weight_version?: string;

  @IsOptional()
  model_version_summary?: Record<string, any>;

  @IsOptional()
  @IsString()
  explanation?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProposedMemberPersistenceDto)
  members: ProposedMemberPersistenceDto[];
}
