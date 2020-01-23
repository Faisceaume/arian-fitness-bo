import { TestBed } from '@angular/core/testing';

import { QuestionnairesService } from './questionnaires.service';

describe('QuestionnairesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuestionnairesService = TestBed.get(QuestionnairesService);
    expect(service).toBeTruthy();
  });
});
