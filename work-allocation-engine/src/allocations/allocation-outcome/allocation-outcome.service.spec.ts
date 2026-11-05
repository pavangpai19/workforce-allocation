import { Test, TestingModule } from '@nestjs/testing';
import { AllocationOutcomeService } from './allocation-outcome.service';

describe('AllocationOutcomeService', () => {
  let service: AllocationOutcomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AllocationOutcomeService],
    }).compile();

    service = module.get<AllocationOutcomeService>(AllocationOutcomeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
