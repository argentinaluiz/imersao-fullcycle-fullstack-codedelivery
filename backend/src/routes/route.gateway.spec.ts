import { Test, TestingModule } from '@nestjs/testing';
import { RouteGateway } from './route.gateway';

describe('RouteGateway', () => {
  let gateway: RouteGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RouteGateway],
    }).compile();

    gateway = module.get<RouteGateway>(RouteGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
