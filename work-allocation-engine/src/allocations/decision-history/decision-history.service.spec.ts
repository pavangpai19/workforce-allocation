import { Test, TestingModule } from '@nestjs/testing';
import { DecisionHistoryService } from './decision-history.service';

describe('DecisionHistoryService', () => {
  let service: DecisionHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DecisionHistoryService],
    }).compile();

    service = module.get<DecisionHistoryService>(DecisionHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
