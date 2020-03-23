import { TestBed } from '@angular/core/testing';

import { AlimentsService } from './aliments.service';

describe('AlimentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlimentsService = TestBed.get(AlimentsService);
    expect(service).toBeTruthy();
  });
});
