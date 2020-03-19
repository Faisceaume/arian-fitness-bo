import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlocDetailsComponent } from './bloc-details.component';

describe('BlocDetailsComponent', () => {
  let component: BlocDetailsComponent;
  let fixture: ComponentFixture<BlocDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlocDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlocDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
