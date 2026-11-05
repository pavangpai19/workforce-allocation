import { IsUUID, IsString, IsNotEmpty, IsNumber, IsPositive, IsDateString, IsOptional } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class AutoAllocateDto {
  @IsUUID()
  project_id: string;

  /**
   * Canonical field: skill name or skill UUID.
   * If legacy skill_name is passed in request body, it will be automatically mapped here.
   */
  @Transform(({ value, obj }) => value || obj?.skill_name)
  @IsString()
  @IsNotEmpty()
  skill: string;

  /**
   * @deprecated Legacy parameter. Standardized on skill.
   */
  @IsOptional()
  @IsString()
  skill_name?: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  required_hours: number;

  @IsDateString()
  week_start_date: string;
}
