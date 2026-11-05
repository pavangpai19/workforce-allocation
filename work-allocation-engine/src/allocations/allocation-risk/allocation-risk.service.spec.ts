import { Test, TestingModule } from '@nestjs/testing';
import { AllocationRiskService } from './allocation-risk.service';

describe('AllocationRiskService', () => {
  let service: AllocationRiskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AllocationRiskService],
    }).compile();

    service = module.get<AllocationRiskService>(AllocationRiskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
