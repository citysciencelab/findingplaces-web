import { Injectable } from '@angular/core';
import { Coordinate } from 'ol/coordinate';
import { Feature } from 'geojson';

import { LocalStorageMessage } from './local-storage-message.model';

@Injectable()
export class LocalStorageService {

  constructor() { }

  sendView(center: number[], zoom: number, scale: number) {
    const message = {
      type: 'view',
      data: {
        center: center,
        zoom: zoom,
        scale: scale
      }
    };
    this.sendMessage(message);
  }

  sendLayers(baseLayers: string[], topicLayers: string[], bezirkeParams: {}) {
    const message = {
      type: 'layers',
      data: {
        baseLayers: baseLayers,
        topicLayers: topicLayers,
        bezirkeParams: bezirkeParams
      }
    };
    this.sendMessage(message);
  }

  sendMatrices(m: { left: number[][]; right: number[][] }) {
    const message = {
      type: 'matrix',
      data: {
        left: m.left,
        right: m.right
      }
    };
    this.sendMessage(message);
  }

  sendStats(show: boolean) {
    const message = {
      type: 'stats',
      data: {
        show: show
      }
    };
    this.sendMessage(message);
  }

  sendClick(coordinate: Coordinate, properties?: {}) {
    const message = {
      type: 'click',
      data: {
        coordinate: coordinate,
        properties: properties
      }
    };
    this.sendMessage(message);
  }

  sendSelectFeature(feature: Feature) {
    const message = {
      type: 'select',
      data: {
        feature: feature
      }
    };
    this.sendMessage(message);
  }

  registerMessageCallback(callback: (message: LocalStorageMessage) => void) {
    window.addEventListener('storage', (event: StorageEvent) => {
      if (event.key !== 'message') {
        return;
      }
      const message = <LocalStorageMessage>JSON.parse(event.newValue);
      if (!message) {
        return;
      }
      callback(message);
    });
  }

  private sendMessage(message: LocalStorageMessage) {
    localStorage.setItem('message', JSON.stringify(message));
    localStorage.removeItem('message');
  }

}
