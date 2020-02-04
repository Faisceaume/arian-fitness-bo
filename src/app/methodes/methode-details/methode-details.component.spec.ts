import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodeDetailsComponent } from './methode-details.component';

describe('MethodeDetailsComponent', () => {
  let component: MethodeDetailsComponent;
  let fixture: ComponentFixture<MethodeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MethodeDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
