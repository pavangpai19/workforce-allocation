import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateStaffingRequirementDto } from './dto/create-staffing-requirement.dto';
import { UpdateStaffingRequirementDto } from './dto/update-staffing-requirement.dto';

@Injectable()
export class StaffingRequirementsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findByProjectId(projectId: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('project_staffing_requirements')
      .select(
        `
        *,
        skills(id, name)
      `,
      )
      .eq('project_id', projectId)
      .order('priority', { ascending: false });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data || [];
  }

  async findById(requirementId: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('project_staffing_requirements')
      .select(
        `
        *,
        skills(id, name)
      `,
      )
      .eq('id', requirementId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Staffing requirement not found');
    }

    return data;
  }

  async create(projectId: string, dto: CreateStaffingRequirementDto) {
    const supabase = this.supabaseService.getClient();

    // Verify project exists
    const { data: project, error: projErr } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .single();

    if (projErr || !project) {
      throw new NotFoundException('Project not found');
    }

    // Verify skill exists
    const { data: skill, error: skillErr } = await supabase
      .from('skills')
      .select('id')
      .eq('id', dto.skill_id)
      .single();

    if (skillErr || !skill) {
      throw new NotFoundException('Skill not found');
    }

    const { data, error } = await supabase
      .from('project_staffing_requirements')
      .insert([
        {
          project_id: projectId,
          required_role: dto.required_role,
          skill_id: dto.skill_id,
          minimum_proficiency: dto.minimum_proficiency,
          required_headcount: dto.required_headcount,
          allocation_hours_per_week: dto.allocation_hours_per_week ?? 40,
          allocation_percentage: dto.allocation_percentage,
          is_mandatory: dto.is_mandatory ?? true,
          priority: dto.priority ?? 3,
        },
      ])
      .select(
        `
        *,
        skills(id, name)
      `,
      )
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  async update(
    projectId: string,
    requirementId: string,
    dto: UpdateStaffingRequirementDto,
  ) {
    const supabase = this.supabaseService.getClient();

    // Verify requirement exists for this project
    await this.findById(requirementId);

    const updatePayload: Record<string, any> = {};
    if (dto.required_role !== undefined) updatePayload.required_role = dto.required_role;
    if (dto.skill_id !== undefined) updatePayload.skill_id = dto.skill_id;
    if (dto.minimum_proficiency !== undefined) updatePayload.minimum_proficiency = dto.minimum_proficiency;
    if (dto.required_headcount !== undefined) updatePayload.required_headcount = dto.required_headcount;
    if (dto.allocation_hours_per_week !== undefined) updatePayload.allocation_hours_per_week = dto.allocation_hours_per_week;
    if (dto.allocation_percentage !== undefined) updatePayload.allocation_percentage = dto.allocation_percentage;
    if (dto.is_mandatory !== undefined) updatePayload.is_mandatory = dto.is_mandatory;
    if (dto.priority !== undefined) updatePayload.priority = dto.priority;

    const { data, error } = await supabase
      .from('project_staffing_requirements')
      .update(updatePayload)
      .eq('id', requirementId)
      .eq('project_id', projectId)
      .select(
        `
        *,
        skills(id, name)
      `,
      )
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  async delete(projectId: string, requirementId: string) {
    const supabase = this.supabaseService.getClient();

    // Verify existence
    await this.findById(requirementId);

    const { error } = await supabase
      .from('project_staffing_requirements')
      .delete()
      .eq('id', requirementId)
      .eq('project_id', projectId);

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      message: 'Staffing requirement successfully deleted',
      id: requirementId,
      project_id: projectId,
    };
  }
}
