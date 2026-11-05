import { Test, TestingModule } from '@nestjs/testing';
import { AllocationFairnessService } from './allocation-fairness.service';

describe('AllocationFairnessService', () => {
  let service: AllocationFairnessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AllocationFairnessService],
    }).compile();

    service = module.get<AllocationFairnessService>(AllocationFairnessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
