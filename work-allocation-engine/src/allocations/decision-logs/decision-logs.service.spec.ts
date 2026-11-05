import { Test, TestingModule } from '@nestjs/testing';
import { DecisionLogsService } from './decision-logs.service';
import { SupabaseService } from '../../supabase/supabase.service';

describe('DecisionLogsService', () => {
  let service: DecisionLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DecisionLogsService,
        {
          provide: SupabaseService,
          useValue: { getClient: jest.fn().mockReturnValue({ from: jest.fn() }) },
        },
      ],
    }).compile();

    service = module.get<DecisionLogsService>(DecisionLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
