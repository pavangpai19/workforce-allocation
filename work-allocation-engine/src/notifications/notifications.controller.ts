import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';

import { NotificationsService } from './notifications.service';

import { SupabaseAuthGuard } from '../auth/guards/supabase-auth/supabase-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('notifications')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  @Roles('ADMIN', 'MANAGER')
  @Get('health')
  health() {
    return {
      module: 'Notifications',
      status: 'Active',
      timestamp: new Date().toISOString(),
    };
  }
}