import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { ConfigurationService } from '../configuration.service';
import { LocalStorageService } from '../communication/local-storage.service';
import { LocalStorageMessage } from '../communication/local-storage-message.model';
import { MapComponent } from '../map/map.component';
import { WebsocketService } from '../communication/websocket.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-projector',
  templateUrl: './projector.component.html',
  styleUrls: ['./projector.component.css']
})
export class ProjectorComponent implements AfterViewInit {
  @ViewChild(MapComponent, { static: false }) mapComponent: MapComponent;
  station: string;
  side: string;

  constructor(private route: ActivatedRoute, private config: ConfigurationService,
              private localStorageService: LocalStorageService, private titleService: Title,
              private websocketService: WebsocketService) {
    // URL params
    this.route.queryParams.subscribe(params => {
      this.station = params['station'];
      this.side = params['side'];
    });

    const side = this.side === 'left' ? ', links' : this.side === 'right' ? ', rechts' : '';
    this.titleService.setTitle(`Beamer (Station ${this.station}${side}) – ${this.config.appName}`);

    // Local storage listener for inter-tab communication
    this.localStorageService.registerMessageCallback((message: LocalStorageMessage) => {
      if (message.type === 'view') {
        this.updateView(message.data.center, message.data.zoom, message.data.scale);
      } else if (message.type === 'layers') {
        this.updateLayers(message.data.baseLayers, message.data.topicLayers, message.data.bezirkeParams);
      }
    });

    this.websocketService.subscribe(environment.websocket_prefix+'flurstueck', this.onWampFlurstueck.bind(this));
  }

  ngAfterViewInit() {
    this.mapComponent.removeZoomControl();
  }

  updateView(center: number[], zoom: number, scale: number) {
    const view = this.mapComponent.map.getView();
    const oldZoom = view.getZoom();

    const bbox = [
      center[0] - scale * this.config.scaleFactorX,
      center[1] - scale * this.config.scaleFactorY,
      center[0] + scale * this.config.scaleFactorX,
      center[1] + scale * this.config.scaleFactorY
    ];

    this.mapComponent.setDebugBbox(bbox);

    // Only station 3 may publish the BBOX, otherwise there will be confusion
    if (this.station === '3') {
      this.websocketService.publish(environment.websocket_prefix+'bbox', bbox);
    }

    // Increase zoom because display is at least twice as large as the map in the control center
    // (This is arbitrary and does not affect the BBOX calculation)
    zoom++;

    // Set the zoom without moving the map so we can calculate the new extent
    view.setZoom(zoom);
    view.cancelAnimations();

    const x0 = bbox[0];
    const y0 = bbox[1];
    const x1 = bbox[2];
    const y1 = bbox[3];

    // Calculate new centers for the left and right halves of the map
    const mapExtent = view.calculateExtent(this.mapComponent.map.getSize());
    const x0Map = mapExtent[0];
    const x1Map = mapExtent[2];
    const dxMap = (x1Map - x0Map) / 2;
    let x: number, y: number;

    if (this.side === 'left') {
      x = x0 + (x1 - x0) / 2 - dxMap;
      y = y0 + (y1 - y0) / 2;
    } else if (this.side === 'right') {
      x = x0 + (x1 - x0) / 2 + dxMap;
      y = y0 + (y1 - y0) / 2;
    } else {
      x = x0 + (x1 - x0) / 2;
      y = y0 + (y1 - y0) / 2;
    }

    // Set zoom back to the previous value and animate
    view.setZoom(oldZoom);
    view.cancelAnimations();
    view.animate({
      duration: 2000,
      center: [x, y],
      zoom: zoom
    });
  }

  updateLayers(baseLayers: string[], topicLayers: string[], bezirkeParams: {}) {
    // Toggle layer visibility
    this.mapComponent.toggleLayers(baseLayers, topicLayers);

    // Bezirke highlight
    this.mapComponent.updateImageWMSParams('bezirkeFilled', bezirkeParams);
  }

  private onWampFlurstueck(args: any[]) {
    if (!environment.production) {
      console.log(...args);
    }
    if (!args || !args.length) {
      return;
    }
    const xy = args[0][2];
    const amount = args[0][1];

    this.mapComponent.setDebugItem(xy, amount);
  }

}
