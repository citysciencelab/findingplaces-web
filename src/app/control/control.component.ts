import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { ConfigurationService } from '../configuration.service';
import { LocalStorageService } from '../communication/local-storage.service';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ControlComponent {
  @ViewChild(MapComponent, { static: false }) mapComponent: MapComponent;
  station: string;
  activeBaseLayers: string[];
  activeTopicLayers: string[];
  bezirkeParams: {};
  center: number[];
  zoom: number;
  zoomStr: string;
  scale: number;
  scaleStr: string;
  resolution: number;
  resolutionStr: string;
  bbox: number[];
  bboxStr: string;
  mouseCoord1: string;
  mouseCoord2: string;
  mouseCoord3: string;
  // Tranformation matrices for the projectors. Initial values are read from config.json
  m: { left: number[][], right: number[][] };
  stats = false;

  constructor(public config: ConfigurationService, private localStorageService: LocalStorageService,
              private route: ActivatedRoute, private titleService: Title) {
    // URL params
    this.route.queryParams.subscribe(params => {
      this.station = params['station'];
    });

    this.titleService.setTitle(`Control (Station ${this.station}) – ${this.config.appName}`);

    // Transformation matrices from config (not defined for station 1)
    this.m = this.config.projectorTransform[this.station];
  }

  onMapMove(evt: { center: [number, number], zoom: number, scale: number }) {
    this.center = evt.center;
    this.zoom = evt.zoom;
    this.scale = evt.scale;

    if (this.station === '2' || this.station === '3') {
      this.sendView();
      this.sendMatrix();
    }
  }

  onPointerMove(evt: { mouseCoord1: string, mouseCoord2: string }) {
    this.mouseCoord1 = evt.mouseCoord1;
    this.mouseCoord2 = evt.mouseCoord2;
  }

  onChangeResolution(evt: { zoom: number, scale: number, resolution: number, bbox: number[] }) {
    this.zoom = evt.zoom;
    this.zoomStr = `${Math.round(this.zoom)}`;

    this.scale = evt.scale;
    this.scaleStr = `${Math.round(this.scale)}`;

    this.resolution = evt.resolution;
    this.resolutionStr = `${Math.round(this.resolution * 1000) / 1000}`;

    this.bbox = evt.bbox;
    const x0 = Math.round(this.bbox[0]);
    const y0 = Math.round(this.bbox[1]);
    const x1 = Math.round(this.bbox[2]);
    const y1 = Math.round(this.bbox[3]);
    this.bboxStr = `${x0}, ${y0}, ${x1}, ${y1}`;
  }

  onLayerChange() {
    this.sendLayers();
  }

  onSelectBezirk(bezirk: string) {
    if (this.station === '1') {
      return;
    }

    this.bezirkeParams = {
      'CQL_FILTER': `bezirk<>'${bezirk}'`
    };

    const map = this.mapComponent.csMap.map;
    let bbox: number[];

    switch (bezirk) {
      case 'Altona':
        bbox = [1083153, 7083797, 1110629, 7100656];
        break;
      case 'Bergedorf':
        bbox = [1118873, 7056414, 1149404, 7080970];
        break;
      case 'Eimsbüttel':
        bbox = [1098634, 7086697, 1114110, 7105185];
        break;
      case 'Hamburg-Mitte':
        bbox = [1091776, 7067396, 1131982, 7088643];
        break;
      case 'Hamburg-Nord':
        bbox = [1108333, 7086585, 1122679, 7110157];
        break;
      case 'Harburg':
        bbox = [1086878, 7059903, 1118940, 7084173];
        break;
      case 'Wandsbek':
        bbox = [1115443, 7087175, 1137903, 7120962];
        break;
      default:
        return;
    }
    const resX = (bbox[2] - bbox[0]) / map.getSize()[0];
    const resY = (bbox[3] - bbox[1]) / map.getSize()[1];
    const newCenter = [bbox[0] + (bbox[2] - bbox[0]) / 2, bbox[1] + (bbox[3] - bbox[1]) / 2];
    const newResolution = Math.max(resX, resY);

    this.mapComponent.setView(newCenter, newResolution);
    this.mapComponent.updateImageWMSParams('bezirkeFilled', this.bezirkeParams);

    this.sendView();
  }

  onToggleStats() {
    this.stats = !this.stats;
    this.localStorageService.sendStats(this.stats);
  }

  updateMatrix(side: string, evt: Event) {
    this.m[side] = evt;
    this.localStorageService.sendMatrices(this.m);
  }

  private sendView() {
    this.localStorageService.sendView(this.center, this.zoom, this.scale);
  }

  private sendLayers() {
    this.activeBaseLayers = this.config.baseLayers.filter(layer => layer.visible).map(layer => layer.name);
    this.activeTopicLayers = this.config.topicLayers.filter(layer => layer.visible).map(layer => layer.name);

    this.localStorageService.sendLayers(this.activeBaseLayers, this.activeTopicLayers, this.bezirkeParams);
  }

  private sendMatrix() {
    this.localStorageService.sendMatrices(this.m);
  }
}
