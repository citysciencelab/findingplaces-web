import { Component, OnChanges, Input } from '@angular/core';

import { Bezirksinfo } from '../../models/bezirksinfo.model';

@Component({
  selector: 'app-bezirk-monitor',
  templateUrl: './bezirk-monitor.component.html',
  styleUrls: ['./bezirk-monitor.component.css']
})
export class BezirkMonitorComponent implements OnChanges {
  @Input() data: Bezirksinfo;
  @Input() heute: string;
  summe1: number;
  summe2: number;
  summe3: number;

  constructor() { }

  ngOnChanges() {
    if (!this.data) {
      return;
    }

    this.summe1 = this.data.untergebracht + this.data.geplant;
    this.summe2 = this.data.vorgeschlagen + this.data.heutevorgeschlagen;
    this.summe3 = this.summe1 + this.summe2;
  }

}
