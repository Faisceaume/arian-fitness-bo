import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnairesDetailComponent } from './questionnaires-detail.component';

describe('QuestionnairesDetailComponent', () => {
  let component: QuestionnairesDetailComponent;
  let fixture: ComponentFixture<QuestionnairesDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionnairesDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionnairesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
