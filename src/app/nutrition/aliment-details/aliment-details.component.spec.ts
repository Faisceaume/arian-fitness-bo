import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlimentDetailsComponent } from './aliment-details.component';

describe('AlimentDetailsComponent', () => {
  let component: AlimentDetailsComponent;
  let fixture: ComponentFixture<AlimentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlimentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlimentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
