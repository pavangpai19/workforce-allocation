import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateStaffingRequirementDto {
  @IsString()
  @IsNotEmpty()
  required_role: string;

  @IsUUID()
  @IsNotEmpty()
  skill_id: string;

  @IsInt()
  @Min(1)
  @Max(5)
  minimum_proficiency: number;

  @IsInt()
  @Min(1)
  required_headcount: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  allocation_hours_per_week?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  allocation_percentage?: number;

  @IsOptional()
  @IsBoolean()
  is_mandatory?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  priority?: number;
}
