export class AuthUserDto {
  employeeId: string;
  authUserId: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
}