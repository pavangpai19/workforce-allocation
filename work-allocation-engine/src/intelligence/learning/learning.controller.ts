import { Controller, Post } from '@nestjs/common';
import { LearningService } from './learning.service';

@Controller('learning')
export class LearningController {
  constructor(private readonly learningService: LearningService) {}

  @Post('run')
  async run() {
    return this.learningService.runLearningCycle();
  }
}