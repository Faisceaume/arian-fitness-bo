import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgrammesListComponent } from './programmes-list.component';

describe('ProgrammesListComponent', () => {
  let component: ProgrammesListComponent;
  let fixture: ComponentFixture<ProgrammesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgrammesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgrammesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
