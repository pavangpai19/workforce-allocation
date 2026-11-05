import { Test, TestingModule } from '@nestjs/testing';
import { DecisionLogsController } from './decision-logs.controller';

describe('DecisionLogsController', () => {
  let controller: DecisionLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DecisionLogsController],
    }).compile();

    controller = module.get<DecisionLogsController>(DecisionLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
