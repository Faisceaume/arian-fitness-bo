import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgrammeDetailsComponent } from './programme-details.component';

describe('ProgrammeDetailsComponent', () => {
  let component: ProgrammeDetailsComponent;
  let fixture: ComponentFixture<ProgrammeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgrammeDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgrammeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
