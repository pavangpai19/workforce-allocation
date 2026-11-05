import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryProbabilityController } from './delivery-probability.controller';

describe('DeliveryProbabilityController', () => {
  let controller: DeliveryProbabilityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryProbabilityController],
    }).compile();

    controller = module.get<DeliveryProbabilityController>(DeliveryProbabilityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
