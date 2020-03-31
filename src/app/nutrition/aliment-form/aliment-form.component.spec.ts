import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlimentFormComponent } from './aliment-form.component';

describe('AlimentFormComponent', () => {
  let component: AlimentFormComponent;
  let fixture: ComponentFixture<AlimentFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlimentFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlimentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
