import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ConfigurationService } from '../configuration.service';
import { NodeAPIService } from '../communication/node-api.service';
import { WebsocketService } from '../communication/websocket.service';
import { Workshop } from '../models/workshop.model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent {
  workshops: Workshop[];

  constructor(private config: ConfigurationService, private titleService: Title,
              private nodeAPIService: NodeAPIService, private websocketService: WebsocketService) {
    this.titleService.setTitle(`Start – ${this.config.appName}`);

    this.nodeAPIService.getWorkshops().subscribe(data => {
      this.workshops = data.map(ws => {
        ws.timestamp_start = new Date(ws.timestamp_start);
        return ws;
      }).filter(ws => {
        return ws.timestamp_start.getFullYear() === 2016;
      }).sort((a, b) => a.title.localeCompare(b.title));
    });
  }

  // Would be nice if this function took an object, but there is a bug with
  // ngModel in forms (https://github.com/angular/angular/issues/14399).
  onSelectWorkshop(i: number) {
    const activeWorkshop = this.workshops[i];

    this.nodeAPIService.getStatistics(activeWorkshop.title).subscribe(data => {
      this.websocketService.publish(environment.websocket_prefix+'monitordata', [activeWorkshop, data]);
    });
  }

}
