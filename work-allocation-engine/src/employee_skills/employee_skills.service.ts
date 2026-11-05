import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class EmployeeSkillsService {
  constructor(
    private readonly supabaseService: SupabaseService,
  ) {}

  async assign(body: any) {
    const supabase =
      this.supabaseService.getClient();

    const { data, error } =
      await supabase
        .from('employee_skills')
        .insert([
          {
            employee_id: body.employee_id,
            skill_id: body.skill_id,
            proficiency_level:
              body.proficiency_level,
          },
        ])
        .select();

    if (error) throw new Error(error.message);

    return data;
  }

  async update(body: any) {
    const supabase =
      this.supabaseService.getClient();

    const { data, error } =
      await supabase
        .from('employee_skills')
        .update({
          proficiency_level:
            body.proficiency_level,
        })
        .eq(
          'employee_id',
          body.employee_id,
        )
        .eq(
          'skill_id',
          body.skill_id,
        )
        .select();

    if (error) throw new Error(error.message);

    return data;
  }

  async findByEmployee(
    employeeId: string,
  ) {
    const supabase =
      this.supabaseService.getClient();

    const { data, error } =
      await supabase
        .from('employee_skills')
        .select(
          `
          *,
          skills(name)
          `,
        )
        .eq(
          'employee_id',
          employeeId,
        );

    if (error) throw new Error(error.message);

    return data;
  }
}