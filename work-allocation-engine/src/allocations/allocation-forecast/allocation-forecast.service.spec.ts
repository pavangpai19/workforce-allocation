import { Test, TestingModule } from '@nestjs/testing';
import { AllocationForecastService } from './allocation-forecast.service';

describe('AllocationForecastService', () => {
  let service: AllocationForecastService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AllocationForecastService],
    }).compile();

    service = module.get<AllocationForecastService>(AllocationForecastService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
