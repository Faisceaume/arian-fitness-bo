import { TestBed } from '@angular/core/testing';

import { NiveauxService } from './niveaux.service';

describe('NiveauxService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NiveauxService = TestBed.get(NiveauxService);
    expect(service).toBeTruthy();
  });
});
