import {
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum AlertType {
  CAPACITY_WARNING = 'CAPACITY_WARNING',
  CAPACITY_EXCEEDED = 'CAPACITY_EXCEEDED',
  STAFFING_GAP = 'STAFFING_GAP',
  HIRING_NEEDED = 'HIRING_NEEDED',
  BURNOUT_RISK = 'BURNOUT_RISK',
}

export enum AlertSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum AlertStatus {
  ACTIVE = 'ACTIVE',
  DISMISSED = 'DISMISSED',
  RESOLVED = 'RESOLVED',
}

export class CreateAlertDto {
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  severity?: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsUUID()
  employee_id?: string;

  @IsOptional()
  @IsUUID()
  project_id?: string;

  @IsOptional()
  @IsUUID()
  proposal_id?: string;

  @IsOptional()
  @IsUUID()
  staffing_requirement_id?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class DismissAlertDto {
  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsUUID()
  manager_id?: string;
}

export class AlertFilterDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsUUID()
  project_id?: string;

  @IsOptional()
  @IsUUID()
  employee_id?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 20;
}
