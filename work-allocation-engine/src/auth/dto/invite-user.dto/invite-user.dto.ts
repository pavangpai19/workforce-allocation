import { IsUUID } from 'class-validator';

export class InviteUserDto {
  @IsUUID()
  employeeId: string;
}