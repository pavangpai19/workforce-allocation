import { Controller, Get, Query } from '@nestjs/common';
import { PredictiveService } from './predictive.service';

@Controller('analytics/predictive')
export class PredictiveController {
  constructor(private readonly service: PredictiveService) {}

  @Get()
  predict(
    @Query('hours') hours: string,
    @Query('week') week: string,
  ) {
    return this.service.predictWorkload(Number(hours), week);
  }
}