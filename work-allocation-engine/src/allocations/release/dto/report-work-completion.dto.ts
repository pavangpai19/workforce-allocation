import { IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class ReportWorkCompletionDto {
  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  deliverables_summary?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  actual_hours_spent?: number;

  @IsOptional()
  @IsUUID()
  employee_id?: string;
}
