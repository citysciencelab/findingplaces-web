import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HamburgMonitorComponent } from './hamburg-monitor.component';

describe('HamburgMonitorComponent', () => {
  let component: HamburgMonitorComponent;
  let fixture: ComponentFixture<HamburgMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HamburgMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HamburgMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
