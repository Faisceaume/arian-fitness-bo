import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterielDetailsComponent } from './materiel-details.component';

describe('MaterielDetailsComponent', () => {
  let component: MaterielDetailsComponent;
  let fixture: ComponentFixture<MaterielDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterielDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterielDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
