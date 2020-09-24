import { Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Feature as GeoJSONFeature } from 'geojson';
import { MapBrowserEvent, Feature } from 'ol';
import Map from 'ol/Map';
import View from 'ol/View';
import ScaleLine from 'ol/control/ScaleLine';
import Zoom from 'ol/control/Zoom';
import { format, Coordinate } from 'ol/coordinate';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import { Image, Tile } from 'ol/layer';
import ImageLayer from 'ol/layer/Image';
import { transform } from 'ol/proj';
import { METERS_PER_UNIT } from 'ol/proj/Units';
import ImageWMS from 'ol/source/ImageWMS';
import TileWMS from 'ol/source/TileWMS';
import Vector from 'ol/source/Vector';
import { CsMap } from 'ol-cityscope';

import { LocalStorageService } from '../communication/local-storage.service';
import { LocalStorageMessage } from '../communication/local-storage-message.model';
import { HttpClient } from '@angular/common/http';

interface WMSFeatureResponse {
  features: GeoJSONFeature[];
  numberReturned: number;
  type: string;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  @Input() side: 'left' | 'right';
  @Input() inlineCSS: string;
  @Output() mapMove = new EventEmitter<{}>();
  @Output() pointerMove = new EventEmitter<{}>();
  @Output() changeResolution = new EventEmitter<{}>();
  map: Map;
  matrix = {
    'left': [[], [], [], []],
    'right': [[], [], [], []]
  };

  constructor(public csMap: CsMap, private http: HttpClient,
              private localStorageService: LocalStorageService) {
    this.map = this.csMap.map;

    // Local storage listener for inter-tab communication
    this.localStorageService.registerMessageCallback((message: LocalStorageMessage) => {
      if (message.type === 'matrix') {
        this.updateMatrix(message.data.left, message.data.right);
      }
    });
  }

  ngAfterViewInit() {
    this.mapElement.nativeElement.style = this.inlineCSS;

    // Initialize map
    this.csMap.setTarget(this.mapElement.nativeElement);
    this.csMap.setView([10.005150, 53.553325], 11, 8, 18);
    this.applyTransform();

    // Register event listeners
    this.csMap.on('moveend', this.onMoveEnd.bind(this));
    this.csMap.on('pointermove', this.onPointerMove.bind(this));
    this.csMap.getView().on('change:resolution', this.onChangeResolution.bind(this));
    this.csMap.on('click', (evt: MapBrowserEvent) => {
      const layer = <ImageLayer>this.csMap.getTopicLayerByName('flurstuecke').olLayers['*'].layer;

      this.getFeatureInfoFromWMS(layer, evt.coordinate).then(result => {
        if (result.features) {
          this.localStorageService.sendSelectFeature(result.features[0]);
        }
      });

      return false;
    });
  }

  /*
   * Transform matrix setter for outside components
   */
  updateMatrix(left: number[][], right: number[][]) {
    this.matrix.left = left;
    this.matrix.right = right;
    this.applyTransform();
  }

  /*
   * Apply the transformation matrices to map element
   */
  applyTransform() {
    if (!this.side) {
      return;
    }
    const m = this.matrix[this.side];

    const row0 = `${m[0][0]}, ${m[0][1]}, ${m[0][2]}, ${m[0][3]}`;
    const row1 = `${m[1][0]}, ${m[1][1]}, ${m[1][2]}, ${m[1][3]}`;
    const row2 = `${m[2][0]}, ${m[2][1]}, ${m[2][2]}, ${m[2][3]}`;
    const row3 = `${m[3][0]}, ${m[3][1]}, ${m[3][2]}, ${m[3][3]}`;
    const matrix = `matrix3d(${row0}, ${row1}, ${row2}, ${row3})`;

    this.map.getTargetElement().style.transform = matrix;
    this.map.getTargetElement().style['transform-origin'] = '0px 0px 0px';
  }

  onPointerMove(evt: MapBrowserEvent) {
    const pixel = evt.map.getPixelFromCoordinate(evt.coordinate);
    const mapDivZoom = evt.map.getView().getZoom();
    pixel[0] = pixel[0] / mapDivZoom;
    pixel[1] = pixel[1] / mapDivZoom;
    const coord3857 = evt.map.getCoordinateFromPixel(pixel);
    const coord4326 = transform(coord3857, 'EPSG:3857', 'EPSG:4326');

    this.pointerMove.emit({
      mouseCoord1: format(coord4326, '{y}, {x}', 6),
      mouseCoord2: format(coord3857, '{x}, {y}', 2),
    });
  }

  onChangeResolution() {
    this.changeResolution.emit({
      zoom: this.getZoom(),
      scale: this.getScale(),
      resolution: this.getResolution(),
      bbox: this.getBbox()
    });
  }

  onMoveEnd() {
    this.mapMove.emit({
      center: this.getCenter(),
      zoom: this.getZoom(),
      scale: this.getScale()
    });
  }

  updateImageWMSParams(layerName: string, params: {}) {
    try {
      const layer = <ImageLayer>this.csMap.getTopicLayerByName(layerName).olLayers['*'].layer;
      (<ImageWMS>layer.getSource()).updateParams(params);
    } catch (e) {
      console.warn(`Is the layer "${layerName}" configured?`);
    }
  }

  setView(center: number[], resolution: number) {
    this.csMap.map.setView(new View({
      center: center,
      resolution: resolution
    }));
  }

  toggleLayers(visibleBaseLayers: string[], visibleTopicLayers: string[]) {
    for (const layer of this.csMap.baseLayers) {
      layer.visible = visibleBaseLayers.indexOf(layer.name) > -1;
    }
    for (const layer of this.csMap.topicLayers) {
      layer.visible = visibleTopicLayers.indexOf(layer.name) > -1;
    }
    this.csMap.syncVisibleLayers();
  }

  setDebugItem(coords: number[], label: string) {
    const layer = this.csMap.getTopicLayerByName('debug');
    const source = <Vector>layer.olLayers['*'].layer.getSource();
    const feature = new Feature({
      geometry: new Point(coords)
    });

    feature.setProperties({ debugLabel: label });
    source.clear();
    source.addFeature(feature);
  }

  setDebugBbox(bbox: number[]) {
    const layer = this.csMap.getTopicLayerByName('bbox');
    const source = <Vector>layer.olLayers['*'].layer.getSource();
    const x0 = bbox[0],
      y0 = bbox[1],
      x1 = bbox[2],
      y1 = bbox[3];
    const feature = new Feature({
      geometry: new Polygon([[[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]]])
    });

    source.clear();
    source.addFeature(feature);
  }

  removeScaleLineControl() {
    const control = this.map.getControls().getArray().find(item => item instanceof ScaleLine);
    this.map.removeControl(control);
  }

  removeZoomControl() {
    const control = this.map.getControls().getArray().find(item => item instanceof Zoom);
    this.map.removeControl(control);
  }

  utmToWebMercator(coord: number[]) {
    return transform(coord, 'EPSG:25832', 'EPSG:3857');
  }

  private getCenter() {
    return this.map.getView().getCenter();
  }

  private getZoom() {
    return this.map.getView().getZoom();
  }

  private getResolution() {
    return this.map.getView().getResolution();
  }

  private getScale() {
    const units = this.map.getView().getProjection().getUnits();
    const dpi = 25.4 / 0.28;
    const mpu = METERS_PER_UNIT[units];
    return this.getResolution() * mpu * 39.37 * dpi;
  }

  private getBbox() {
    return this.map.getView().calculateExtent(this.map.getSize());
  }

  private getFeatureInfoFromWMS(olLayer: Image | Tile, coordinate: Coordinate) {
    let source: ImageWMS | TileWMS;
    if (olLayer instanceof Image) {
      source = <ImageWMS>olLayer.getSource();
    } else if (olLayer instanceof Tile) {
      source = <TileWMS>olLayer.getSource();
    }
    const url = source.getGetFeatureInfoUrl(
      coordinate,
      this.map.getView().getResolution(),
      this.map.getView().getProjection(), {
        'INFO_FORMAT': 'application/json'
      }
    );

    if (url) {
      return <Promise<WMSFeatureResponse>>this.http.get(url).toPromise();
    }
  }

}
