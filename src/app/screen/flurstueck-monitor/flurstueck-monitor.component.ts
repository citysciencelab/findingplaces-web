import { Component, ViewChild, AfterViewInit, Input, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FeatureCollection, Polygon } from 'geojson';
import { Coordinate } from 'ol/coordinate';

import { environment } from '../../../environments/environment';
import { MapComponent } from '../../map/map.component';
import { Flurstueck } from '../../models/flurstueck.model';
import { Comment } from '../../models/comment.model';
import { NodeAPIService } from '../../communication/node-api.service';

@Component({
  selector: 'app-flurstueck-monitor',
  templateUrl: './flurstueck-monitor.component.html',
  styleUrls: ['./flurstueck-monitor.component.css']
})
export class FlurstueckMonitorComponent implements AfterViewInit {
  @ViewChild(MapComponent, { static: false }) mapComponent: MapComponent;
  @Input() fsk: string;
  @Input() click: Coordinate;
  fskShort: string;
  fs: Flurstueck;
  comments: Comment[];
  time: string;

  constructor(private http: HttpClient, private nodeAPIService: NodeAPIService) { }

  ngAfterViewInit() {
    this.mapComponent.removeZoomControl();
    this.mapComponent.toggleLayers(['dop20'], []);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.fsk) {
      const fsk = this.fsk;

      if (!this.fsk) {
        return;
      }

      this.fskShort = fsk.split('_').filter((e: string) => !!e)[1];

      // Get flurstueck data. Don't use this.fsk because it may be overwritten
      // before the promise is fulfilled
      this.getFlurstueck(fsk).then(result => {
        this.fitMap(result.bbox, result.fsk);
      });
      // Get comments
      this.getComments(fsk);
    }
  }

  /*
   * Determine the bounding box of a single flurstueck
   * by requesting the corresponding feature from the WFS
   */
  private async getFlurstueck(fsk: string): Promise<{ fsk: string, bbox: number[] }> {
    let wfsUrl = environment.geoserverUrl + '/ows' +
      '?service=WFS' +
      '&version=1.0.0' +
      '&request=GetFeature' +
      '&typeName=flurstuecke' +
      '&outputFormat=application/json';

    // If an fsk identifier is given, use it to find the parcel. Otherwise use coordinate
    if (fsk) {
      wfsUrl += `&CQL_FILTER=fsk='${fsk}'`;
    }

    wfsUrl = encodeURI(wfsUrl);

    return this.http.get(wfsUrl).toPromise().then((geojson: FeatureCollection) => {
      this.fs = <Flurstueck>geojson.features[0];
      const geom = <Polygon>this.fs.geometry;
      const bbox = [10000000, 10000000, 0, 0];

      for (const point of geom.coordinates[0]) {
        bbox[0] = Math.min(bbox[0], point[0]);
        bbox[1] = Math.min(bbox[1], point[1]);
        bbox[2] = Math.max(bbox[2], point[0]);
        bbox[3] = Math.max(bbox[3], point[1]);
      }
      return { fsk: fsk ? fsk : this.fs.properties.fsk, bbox: bbox };
    }, () => {
      console.error('Failed to retrieve data from WFS.');
      return null;
    });
  }

  /*
   * Request workshop comments from WFS
   */
  private getComments(fsk: string) {
    let wfsUrl = environment.geoserverUrl + '/ows' +
      '?service=WFS' +
      '&version=1.0.0' +
      '&request=GetFeature' +
      '&typeName=comments' +
      '&outputFormat=application/json' +
      `&CQL_FILTER=fsk='${fsk}'`;

    wfsUrl = encodeURI(wfsUrl);

    this.http.get(wfsUrl).toPromise().then((geojson: FeatureCollection) => {
      this.comments = <Comment[]>geojson.features;
    }, () => {
      console.error('Failed to retrieve data from WFS.');
    });
  }

  private fitMap(bbox: number[], fsk: string) {
    const min = this.mapComponent.utmToWebMercator([bbox[0], bbox[1]]);
    const max = this.mapComponent.utmToWebMercator([bbox[2], bbox[3]]);
    const bbox3857 = [min[0], min[1], max[0], max[1]];
    const filter = {
      'CQL_FILTER': `fsk='${fsk}'`
    };

    this.mapComponent.map.getView().fit(bbox3857);
    this.mapComponent.toggleLayers(['dop20'], ['flurstueckeGrenzen', 'flurstueckskarte']);
    this.mapComponent.updateImageWMSParams('flurstueckskarte', filter);
    this.mapComponent.updateImageWMSParams('flurstueckeGrenzen', filter);
  }

}
