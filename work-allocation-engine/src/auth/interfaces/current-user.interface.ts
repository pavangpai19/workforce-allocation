export interface CurrentUser {
  authUserId: string;
  employeeId: string;
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  email?: string;
}