import { IsOptional, IsString } from 'class-validator';

export class DashboardMetricsFilterDto {
  @IsOptional()
  @IsString()
  manager_id?: string;
}

export class AllocationTrendsFilterDto {
  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsString()
  period?: 'week' | 'month';
}
