import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class DecisionHistoryService {

  constructor(
    private readonly supabaseService: SupabaseService
  ) {}

  async getAllDecisions() {

    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('allocation_decisions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  }

  async getDecisionsByProject(project_id: string) {

    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('allocation_decisions')
      .select('*')
      .eq('project_id', project_id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  }

}