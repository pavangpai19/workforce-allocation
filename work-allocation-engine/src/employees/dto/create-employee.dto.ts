import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateEmployeeDto {

  @IsString()
  name: string;

  @IsNumber()
  capacity_hours: number;

  @IsOptional()
  @IsString()
  department?: string;

}