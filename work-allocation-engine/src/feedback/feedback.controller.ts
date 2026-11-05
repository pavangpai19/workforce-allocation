import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { FeedbackService } from './feedback.service';

import { SupabaseAuthGuard } from '../auth/guards/supabase-auth/supabase-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('feedback')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class FeedbackController {
  constructor(
    private readonly feedbackService: FeedbackService,
  ) {}

  /**
   * Learning feedback
   */
  @Roles('ADMIN', 'MANAGER')
  @Post()
  async record(
    @Body() body: any,
  ) {
    return this.feedbackService.recordFeedback({
      employee_id: body.employee_id,
      project_id: body.project_id,
      allocation_id: body.allocation_id,
      actual_performance: body.actual_performance,
      expected_performance: body.expected_performance,
    });
  }

  /**
   * Manager feedback
   */
  @Roles('ADMIN', 'MANAGER')
  @Post('manager')
  async managerFeedback(
    @Body() body: any,
  ) {
    return this.feedbackService.recordManagerFeedback(body);
  }

  @Roles('ADMIN', 'MANAGER')
  @Get('manager/:employeeId')
  async getManagerFeedback(
    @Param('employeeId')
    employeeId: string,
  ) {
    return this.feedbackService.getManagerFeedback(
      employeeId,
    );
  }
}