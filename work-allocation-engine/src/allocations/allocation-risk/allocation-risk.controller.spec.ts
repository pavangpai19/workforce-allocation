import { Test, TestingModule } from '@nestjs/testing';
import { AllocationRiskController } from './allocation-risk.controller';

describe('AllocationRiskController', () => {
  let controller: AllocationRiskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AllocationRiskController],
    }).compile();

    controller = module.get<AllocationRiskController>(AllocationRiskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
