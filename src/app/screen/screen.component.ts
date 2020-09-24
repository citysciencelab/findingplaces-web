import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Feature } from 'geojson';

import { environment } from '../../environments/environment';
import { ConfigurationService } from '../configuration.service';
import { LocalStorageService } from '../communication/local-storage.service';
import { LocalStorageMessage } from '../communication/local-storage-message.model';
import { WebsocketService } from '../communication/websocket.service';
import { MapComponent } from '../map/map.component';
import { Bezirksinfo } from '../models/bezirksinfo.model';
import { Workshop } from '../models/workshop.model';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css']
})
export class ScreenComponent implements AfterViewInit {
  @ViewChild(MapComponent, { static: false }) mapComponent: MapComponent;
  station: string;
  datum: string;
  legende1aShowRot = false;
  legende1aShowOrange = false;
  legende1aShowGelb = false;
  legende1aShowAlle = false;
  legende1aShowAbgelehnt = false;
  legende1bShowBestehende = false;
  legende1bShowGeplante = false;
  legende1bShowVorgeschlagene = false;
  showStats = false;
  monitorData: {
    'unterzubringende': number;
    'sessionbezirk': string;
    'bezirke': Bezirksinfo[];
  };
  workshopData: Bezirksinfo;
  flurstueck: string;

  constructor(private config: ConfigurationService, private route: ActivatedRoute,
              private titleService: Title, private localStorageService: LocalStorageService,
              private websocketService: WebsocketService) {
    // URL params
    this.route.queryParams.subscribe(params => {
      this.station = params['station'];
    });

    this.titleService.setTitle(`Monitor (Station ${this.station}) – ${this.config.appName}`);

    // Local storage listener for inter-tab communication
    this.localStorageService.registerMessageCallback((message: LocalStorageMessage) => {
      if (message.type === 'layers') {
        this.updateLayers(message.data.baseLayers, message.data.topicLayers, message.data.bezirkeParams);
      } else if (message.type === 'stats') {
        this.showStats = message.data.show;
      } else if (message.type === 'select') {
        const feature = <Feature>message.data.feature;
        if (feature) {
          this.flurstueck = feature.properties.fsk;
        }
      }
    });

    // Websocket listeners
    this.websocketService.subscribe(environment.websocket_prefix+'monitordata', this.onWampMonitorData.bind(this));
    this.websocketService.subscribe(environment.websocket_prefix+'flurstueck', this.onWampFlurstueck.bind(this));
  }

  ngAfterViewInit() {
    if (this.mapComponent) {
      this.mapComponent.removeZoomControl();
      this.mapComponent.removeScaleLineControl();
    }
  }

  updateLayers(baseLayers: string[], topicLayers: string[], bezirkeParams: {}) {
    if (this.mapComponent) {
      // Toggle layer visibility
      this.mapComponent.toggleLayers(baseLayers, topicLayers);

      // Bezirke highlight
      this.mapComponent.updateImageWMSParams('bezirkeFilled', bezirkeParams);
    }

    // Update legends
    this.legende1aShowRot = topicLayers.indexOf('flurstueckeRot') > -1;
    this.legende1aShowOrange = topicLayers.indexOf('flurstueckeOrange') > -1;
    this.legende1aShowGelb = topicLayers.indexOf('flurstueckeGelb') > -1;
    this.legende1aShowAlle = topicLayers.indexOf('flurstuecke') > -1;
    this.legende1aShowAbgelehnt = topicLayers.indexOf('flurstueckeAbgelehnt') > -1;
    this.legende1bShowBestehende = topicLayers.indexOf('bestehende') > -1;
    this.legende1bShowGeplante = topicLayers.indexOf('geplante') > -1;
    this.legende1bShowVorgeschlagene = topicLayers.indexOf('vorgeschlagene') > -1;
  }

  private onWampMonitorData(args: [Workshop, Bezirksinfo[]]) {
    if (!environment.production) {
      console.log(...args);
    }
    if (!args || !args.length) {
      return;
    }
    const workshop = args[0],
      bezirke = args[1];

    this.monitorData = {
      'unterzubringende': 20000,
      'sessionbezirk': workshop.bezirk,
      'bezirke': bezirke
    };

    this.workshopData = this.monitorData.bezirke.find(b => b.bezirk === workshop.bezirk);

    const d = new Date(workshop.timestamp_start);
    const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

    this.datum = `${d.getDate()}. ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  private onWampFlurstueck(args: string[]) {
    if (!environment.production) {
      console.log(...args);
    }
    if (!args || !args.length) {
      return;
    }
    this.flurstueck = args[0][0];
  }

}
