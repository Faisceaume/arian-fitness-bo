import { TestBed } from '@angular/core/testing';

import { ObjectifsService } from './objectifs.service';

describe('ObjectifsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ObjectifsService = TestBed.get(ObjectifsService);
    expect(service).toBeTruthy();
  });
});
