import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TropheesListComponent } from './trophees-list.component';

describe('TropheesListComponent', () => {
  let component: TropheesListComponent;
  let fixture: ComponentFixture<TropheesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TropheesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TropheesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
