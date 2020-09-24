import { Injectable } from '@angular/core';
import { MapLayer } from 'ol-cityscope';
import config from './config.json';

@Injectable()
export class ConfigurationService {
  // Config fields are defined in typings.d.ts
  appName: string;
  baseLayers: MapLayer[];
  topicLayers: MapLayer[];
  projectorTransform: { [key: string]: { left: number[][], right: number[][] } };
  scaleFactorX: number;
  scaleFactorY: number;
  singleDesk: boolean;

  constructor() {
    this.appName = config.appName;
    this.baseLayers = config.baseLayers;
    this.topicLayers = config.topicLayers;
    this.projectorTransform = config.projectorTransform;
    this.scaleFactorX = config.scaleFactorX;
    this.scaleFactorY = config.scaleFactorY;
    this.singleDesk = config.singleDesk;
  }
}
