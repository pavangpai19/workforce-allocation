import { Test, TestingModule } from '@nestjs/testing';
import { PredictiveController } from './predictive.controller';
import { PredictiveService } from './predictive.service';

describe('PredictiveController', () => {
  let controller: PredictiveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PredictiveController],
      providers: [
        {
          provide: PredictiveService,
          useValue: { predictWorkload: jest.fn().mockResolvedValue([]) },
        },
      ],
    }).compile();

    controller = module.get<PredictiveController>(PredictiveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
