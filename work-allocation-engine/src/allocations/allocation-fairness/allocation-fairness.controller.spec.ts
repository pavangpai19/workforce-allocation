import { Test, TestingModule } from '@nestjs/testing';
import { AllocationFairnessController } from './allocation-fairness.controller';

describe('AllocationFairnessController', () => {
  let controller: AllocationFairnessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AllocationFairnessController],
    }).compile();

    controller = module.get<AllocationFairnessController>(AllocationFairnessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
