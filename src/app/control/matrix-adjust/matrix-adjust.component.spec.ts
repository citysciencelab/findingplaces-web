import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixAdjustComponent } from './matrix-adjust.component';

describe('MatrixAdjustComponent', () => {
  let component: MatrixAdjustComponent;
  let fixture: ComponentFixture<MatrixAdjustComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatrixAdjustComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatrixAdjustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
