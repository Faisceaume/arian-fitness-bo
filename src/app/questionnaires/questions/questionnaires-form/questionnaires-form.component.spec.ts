import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnairesFormComponent } from './questionnaires-form.component';

describe('QuestionnairesFormComponent', () => {
  let component: QuestionnairesFormComponent;
  let fixture: ComponentFixture<QuestionnairesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionnairesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionnairesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
