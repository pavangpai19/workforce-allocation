import { IsOptional, IsString, IsUUID } from 'class-validator';

export class ConfirmReleaseDto {
  @IsOptional()
  @IsString()
  release_notes?: string;

  @IsOptional()
  @IsUUID()
  manager_id?: string;
}

export class ReviewCompletionDto {
  @IsOptional()
  @IsString()
  review_notes?: string;

  @IsOptional()
  @IsUUID()
  manager_id?: string;

  @IsOptional()
  @IsString()
  performance_feedback?: string;
}
