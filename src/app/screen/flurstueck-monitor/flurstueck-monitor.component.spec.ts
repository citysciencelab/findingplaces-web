import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlurstueckMonitorComponent } from './flurstueck-monitor.component';

describe('FlurstueckMonitorComponent', () => {
  let component: FlurstueckMonitorComponent;
  let fixture: ComponentFixture<FlurstueckMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlurstueckMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlurstueckMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
