import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { NlpService } from '../nlp/nlp.service';
import { EmployeeIntelligenceService } from './reasoning/employee-intelligence/employee-intelligence.service';

import { ProfileBuilderService } from './profile-builder/profile-builder.service';

@Injectable()
export class AiService {
  constructor(
  private readonly supabaseService: SupabaseService,
  private readonly nlpService: NlpService,
  private readonly employeeIntelligenceService: EmployeeIntelligenceService,
  private readonly profileBuilderService: ProfileBuilderService,
) {}

  async generateProfile(employeeId: string) {
    const supabase = this.supabaseService.getClient();

    const { data: knowledge } = await supabase
      .from('employee_knowledge')
      .select('*')
      .eq('employee_id', employeeId)
      .single();

    if (!knowledge) {
      throw new NotFoundException('Knowledge not generated');
    }

    const { data: feedback } = await supabase
      .from('manager_feedback')
      .select('*')
      .eq('employee_id', employeeId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const nlp =
  feedback == null
    ? {
        profile: {
          communication: 0.5,
          leadership: 0.5,
          ownership: 0.5,
          documentation: 0.5,
        },
        keywords: [],
        summary: '',
      }
    : this.nlpService.analyzeFeedback({
        strengths: feedback.strengths,
        weaknesses: feedback.weaknesses,
        comments: feedback.comments,
      });

    const intelligence =
    await this.employeeIntelligenceService.analyze(
    knowledge,
    nlp,
  );

const profile =
  this.profileBuilderService.build(
    employeeId,
    knowledge,
    nlp,
    intelligence,
  );

    const { error } = await supabase
      .from('employee_profiles')
      .upsert(profile, {
        onConflict: 'employee_id',
      });

    if (error) throw error;

    return {
      success: true,
      profile,
    };
  }
}