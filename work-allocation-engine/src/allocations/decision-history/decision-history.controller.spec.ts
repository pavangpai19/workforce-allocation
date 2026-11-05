import { Test, TestingModule } from '@nestjs/testing';
import { DecisionHistoryController } from './decision-history.controller';

describe('DecisionHistoryController', () => {
  let controller: DecisionHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DecisionHistoryController],
    }).compile();

    controller = module.get<DecisionHistoryController>(DecisionHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
