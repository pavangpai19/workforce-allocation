import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryProbabilityService } from './delivery-probability.service';

describe('DeliveryProbabilityService', () => {
  let service: DeliveryProbabilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryProbabilityService],
    }).compile();

    service = module.get<DeliveryProbabilityService>(DeliveryProbabilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
