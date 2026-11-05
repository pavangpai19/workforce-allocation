import { Controller, Param, Post } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('profile/:employeeId')
  generate(@Param('employeeId') employeeId: string) {
    return this.aiService.generateProfile(employeeId);
  }
}