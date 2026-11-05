import { Body, Controller, Post } from '@nestjs/common';
import { NlpService } from './nlp.service';

@Controller('nlp')
export class NlpController {
  constructor(private readonly nlpService: NlpService) {}

  @Post('analyze')
  analyze(@Body() body: any) {
    return this.nlpService.analyzeFeedback(body);
  }
}