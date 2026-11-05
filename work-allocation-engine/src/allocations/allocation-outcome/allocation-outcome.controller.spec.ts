import { Test, TestingModule } from '@nestjs/testing';
import { AllocationOutcomeController } from './allocation-outcome.controller';

describe('AllocationOutcomeController', () => {
  let controller: AllocationOutcomeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AllocationOutcomeController],
    }).compile();

    controller = module.get<AllocationOutcomeController>(AllocationOutcomeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
