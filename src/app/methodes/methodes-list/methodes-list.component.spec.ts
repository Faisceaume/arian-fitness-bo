import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodesListComponent } from './methodes-list.component';

describe('MethodesListComponent', () => {
  let component: MethodesListComponent;
  let fixture: ComponentFixture<MethodesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MethodesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
