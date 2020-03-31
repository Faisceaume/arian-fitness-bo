import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrognutsListComponent } from './prognuts-list.component';

describe('PrognutsListComponent', () => {
  let component: PrognutsListComponent;
  let fixture: ComponentFixture<PrognutsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrognutsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrognutsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
