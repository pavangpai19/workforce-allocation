import { Test, TestingModule } from '@nestjs/testing';
import { ExplanationService } from './explanation.service';

describe('ExplanationService', () => {
  let service: ExplanationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExplanationService],
    }).compile();

    service = module.get<ExplanationService>(ExplanationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
