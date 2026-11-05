import { Test, TestingModule } from '@nestjs/testing';
import { HiringSignalController } from './hiring-signal.controller';

describe('HiringSignalController', () => {
  let controller: HiringSignalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HiringSignalController],
    }).compile();

    controller = module.get<HiringSignalController>(HiringSignalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
