import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

import { SupabaseService } from '../supabase/supabase.service';
import { SignupDto } from './dto/signup.dto/signup.dto';
import { LoginDto } from './dto/login.dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
  ) {}

  async login(dto: LoginDto) {
    // Dedicated client for user auth so the singleton service_role client is not mutated
    const authClient = createClient(
      process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder-key',
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    const { data, error } = await authClient.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (error || !data?.session) {
      throw new UnauthorizedException(error?.message || 'Invalid credentials');
    }

    const supabase = this.supabaseService.getClient();

    const { data: empAuth, error: empAuthError } = await supabase
      .from('employee_auth')
      .select('employee_id, role, employees(name, email)')
      .eq('auth_user_id', data.user.id)
      .single();

    if (empAuthError || !empAuth) {
      throw new UnauthorizedException('No employee record mapped to this authenticated account');
    }

    return {
      success: true,
      access_token: data.session.access_token,
      user: {
        authUserId: data.user.id,
        employeeId: empAuth.employee_id,
        role: empAuth.role as 'ADMIN' | 'MANAGER' | 'EMPLOYEE',
        email: data.user.email,
        name: (empAuth as any)?.employees?.name || dto.email.split('@')[0],
      },
    };
  }

  async signup(dto: SignupDto) {
    const supabase = this.supabaseService.getClient();

    const { data: employee } = await supabase
      .from('employees')
      .select('id, email')
      .eq('id', dto.employeeId)
      .single();

    if (!employee) {
      throw new BadRequestException('Employee not found');
    }

    const { data, error } =
      await supabase.auth.admin.createUser({
        email: dto.email,
        password: dto.password,
        email_confirm: true,
      });

    if (error) {
      throw new BadRequestException(error.message);
    }

    const { error: updateError } = await supabase
      .from('employee_auth')
      .update({
        auth_user_id: data.user.id,
        is_active: true,
      })
      .eq('employee_id', dto.employeeId);

    if (updateError) {
      throw new BadRequestException(updateError.message);
    }

    return {
      success: true,
      authUserId: data.user.id,
    };
  }

  async me(user: any) {
    return user;
  }
}
