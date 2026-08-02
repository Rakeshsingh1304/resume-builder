import { Test, TestingModule } from '@nestjs/testing';
import { CoverLettersController } from './cover-letters.controller';

describe('CoverLettersController', () => {
  let controller: CoverLettersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoverLettersController],
    }).compile();

    controller = module.get<CoverLettersController>(CoverLettersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
