import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class RejectProposalDto {
  @IsString()
  @IsNotEmpty()
  review_comment: string;

  @IsOptional()
  @IsUUID()
  manager_id?: string;
}
