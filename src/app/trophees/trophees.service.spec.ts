import { TestBed } from '@angular/core/testing';

import { TropheesService } from './trophees.service';

describe('TropheesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TropheesService = TestBed.get(TropheesService);
    expect(service).toBeTruthy();
  });
});
