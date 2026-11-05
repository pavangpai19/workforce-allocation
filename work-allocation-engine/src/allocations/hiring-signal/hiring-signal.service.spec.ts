import { Test, TestingModule } from '@nestjs/testing';
import { HiringSignalService } from './hiring-signal.service';

describe('HiringSignalService', () => {
  let service: HiringSignalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HiringSignalService],
    }).compile();

    service = module.get<HiringSignalService>(HiringSignalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
