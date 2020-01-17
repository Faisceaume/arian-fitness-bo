import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterielsListComponent } from './materiels-list.component';

describe('MaterielsListComponent', () => {
  let component: MaterielsListComponent;
  let fixture: ComponentFixture<MaterielsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterielsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterielsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
