import { Test, TestingModule } from '@nestjs/testing';
import { PredictiveService } from './predictive.service';
import { SupabaseService } from '../../supabase/supabase.service';

describe('PredictiveService', () => {
  let service: PredictiveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PredictiveService,
        {
          provide: SupabaseService,
          useValue: { getClient: jest.fn().mockReturnValue({ from: jest.fn() }) },
        },
      ],
    }).compile();

    service = module.get<PredictiveService>(PredictiveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
