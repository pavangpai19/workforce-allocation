import { IsOptional, IsString, IsUUID } from 'class-validator';

export class ApproveProposalDto {
  @IsOptional()
  @IsString()
  review_comment?: string;

  @IsOptional()
  @IsUUID()
  manager_id?: string;
}
