import { Component, OnChanges, Input } from '@angular/core';

import { Bezirksinfo } from '../../models/bezirksinfo.model';

@Component({
  selector: 'app-hamburg-monitor',
  templateUrl: './hamburg-monitor.component.html',
  styleUrls: ['./hamburg-monitor.component.css']
})
export class HamburgMonitorComponent implements OnChanges {
  @Input() data: {
    'unterzubringende': number;
    'sessionbezirk': string;
    'bezirke': Bezirksinfo[];
  };
  @Input() heute: string;
  anz = 0;
  bezirkszahlen = [];
  vorgeschlagen = 0;
  bestandgeplant = 0;
  unterzubringende = 0;

  constructor() { }

  ngOnChanges() {
    if (!this.data) {
      return;
    }

    this.bezirkszahlen = [];
    this.vorgeschlagen = 0;
    this.bestandgeplant = 0;
    this.unterzubringende = 0;

    this.data.bezirke.forEach((item: Bezirksinfo) => {

      this.vorgeschlagen += item.vorgeschlagen + item.heutevorgeschlagen;
      this.bestandgeplant += item.untergebracht + item.geplant;

      this.bezirkszahlen.push({
        bezirk: item.bezirk,
        untergebracht: item.untergebracht,
        geplant: item.geplant,
        vorgeschlagen: item.vorgeschlagen,
        heutevorgeschlagen: item.heutevorgeschlagen,
        gesamt: item.untergebracht + item.geplant + item.vorgeschlagen + item.heutevorgeschlagen
      });
    });

    this.unterzubringende = Math.max(0, this.data.unterzubringende - this.vorgeschlagen);
  }

}
