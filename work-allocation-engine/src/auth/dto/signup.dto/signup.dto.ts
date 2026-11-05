import {
  IsEmail,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @IsUUID()
  employeeId: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}