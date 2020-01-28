import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterielsSharedComponent } from './materiels-shared.component';

describe('MaterielsSharedComponent', () => {
  let component: MaterielsSharedComponent;
  let fixture: ComponentFixture<MaterielsSharedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterielsSharedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterielsSharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
