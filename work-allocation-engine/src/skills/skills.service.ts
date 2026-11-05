import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class SkillsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll() {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('skills')
      .select('*');

    if (error) throw new Error(error.message);

    return data;
  }

  async create(body: any) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('skills')
      .insert([{ name: body.name }])
      .select();

    if (error) throw new Error(error.message);

    return data;
  }

  async assignSkillToEmployee(body: any) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('employee_skills')
      .insert([
        {
          employee_id: body.employee_id,
          skill_id: body.skill_id,
          proficiency_level: body.proficiency_level,
        },
      ])
      .select();

    if (error) throw new Error(error.message);

    return data;
  }
}