import { Controller, Get } from '@nestjs/common';
import { OverviewService } from './overview.service';

@Controller('intelligence')
export class OverviewController {

  constructor(
    private readonly overviewService: OverviewService
  ) {}

  @Get('overview')
  async getOverview() {
    return this.overviewService.getOverview();
  }

}