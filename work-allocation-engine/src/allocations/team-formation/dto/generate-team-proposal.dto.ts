import {
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsPositive,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GenerateTeamProposalDto {
  @IsUUID()
  @IsNotEmpty()
  project_id: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  max_candidates_per_role?: number = 5;

  @IsOptional()
  @IsBoolean()
  include_fairness_adjustment?: boolean = true;
}
