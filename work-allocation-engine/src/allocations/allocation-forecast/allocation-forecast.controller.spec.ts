import { Test, TestingModule } from '@nestjs/testing';
import { AllocationForecastController } from './allocation-forecast.controller';

describe('AllocationForecastController', () => {
  let controller: AllocationForecastController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AllocationForecastController],
    }).compile();

    controller = module.get<AllocationForecastController>(AllocationForecastController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
