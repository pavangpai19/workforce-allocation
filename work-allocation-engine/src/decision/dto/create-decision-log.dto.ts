import {
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export enum DecisionType {
  ALLOCATION = 'ALLOCATION',
  RELEASE = 'RELEASE',
  REJECTION = 'REJECTION',
  PROPOSAL_CREATION = 'PROPOSAL_CREATION',
  PROPOSAL_APPROVAL = 'PROPOSAL_APPROVAL',
  PROPOSAL_REJECTION = 'PROPOSAL_REJECTION',
  WORK_COMPLETION = 'WORK_COMPLETION',
  STAFFING_GAP = 'STAFFING_GAP',
  HIRING_SIGNAL = 'HIRING_SIGNAL',
}

export enum DecisionOutcome {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  RELEASED = 'RELEASED',
  COMMITTED = 'COMMITTED',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  DISMISSED = 'DISMISSED',
}

export class CreateDecisionLogDto {
  @IsString()
  decision_type: string;

  @IsString()
  entity_id: string;

  @IsOptional()
  @IsString()
  entity_type?: string;

  @IsOptional()
  @IsUUID()
  employee_id?: string;

  @IsOptional()
  @IsUUID()
  project_id?: string;

  @IsOptional()
  @IsObject()
  decision_context?: Record<string, any>;

  @IsOptional()
  @IsString()
  decision_outcome?: string;

  @IsOptional()
  @IsString()
  decided_by?: string;

  @IsOptional()
  @IsString()
  explanation?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  fairness?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  performance?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  skill_score?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  knowledge_score?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  risk_score?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  confidence?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  final_score?: number;
}
