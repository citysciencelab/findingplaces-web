import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BezirkMonitorComponent } from './bezirk-monitor.component';

describe('BezirkMonitorComponent', () => {
  let component: BezirkMonitorComponent;
  let fixture: ComponentFixture<BezirkMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BezirkMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BezirkMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
