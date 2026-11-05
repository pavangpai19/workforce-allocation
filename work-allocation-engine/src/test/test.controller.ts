import { Controller, Get, Post, Body } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Controller('test')
export class TestController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get()
  async testConnection() {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('employees')
      .select('*');

    if (error) {
      return { error: error.message };
    }

    return { success: true, data };
  }

  @Post('employee')
  async createEmployee(@Body() body: any) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('employees')
      .insert([
        {
          name: body.name,
          email: body.email,
          weekly_capacity_hours: body.weekly_capacity_hours,
        },
      ])
      .select();

    if (error) {
      return { error: error.message };
    }

    return { success: true, data };
  }
}