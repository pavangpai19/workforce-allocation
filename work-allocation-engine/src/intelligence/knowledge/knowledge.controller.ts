import { Controller, Param, Post } from '@nestjs/common';
import { KnowledgeService } from './knowledge.service';

@Controller('intelligence/knowledge')
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Post(':employeeId')
  buildKnowledge(@Param('employeeId') employeeId: string) {
    return this.knowledgeService.buildKnowledge(employeeId);
  }
}