import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { SupabaseService } from '../../../supabase/supabase.service';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing access token');
    }

    const token = authHeader.replace('Bearer ', '');

    const supabase = this.supabaseService.getClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const { data: employee, error: employeeError } = await supabase
      .from('employee_auth')
      .select('employee_id, role')
      .eq('auth_user_id', user.id)
      .single();

    if (employeeError || !employee) {
      throw new UnauthorizedException('Employee mapping not found for authenticated account');
    }

    request.user = {
      authUserId: user.id,
      employeeId: employee.employee_id,
      role: employee.role,
      email: user.email,
    };

    return true;
  }
}
