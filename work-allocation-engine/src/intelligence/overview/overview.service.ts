import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class OverviewService {

  constructor(
    private readonly supabaseService: SupabaseService
  ) {}

  async getOverview() {

    const supabase = this.supabaseService.getClient();

    const { data: employees } = await supabase
      .from('employees')
      .select('*');

    const { data: allocations } = await supabase
      .from('allocations')
      .select('*');

    const { data: decisions } = await supabase
      .from('allocation_decisions')
      .select('*');

    const totalEmployees = employees?.length || 0;
    const totalAllocations = allocations?.length || 0;

    const overloaded = allocations?.filter(
      (a) => a.allocated_hours > 40
    ).length;

    const avgDecisionScore =
      decisions?.reduce((sum, d) => sum + d.final_score, 0) /
      (decisions?.length || 1);

    return {
      workforce_summary: {
        total_employees: totalEmployees,
        total_allocations: totalAllocations
      },
      risk_summary: {
        overloaded_allocations: overloaded
      },
      decision_summary: {
        average_decision_score: avgDecisionScore
      }
    };
  }

}