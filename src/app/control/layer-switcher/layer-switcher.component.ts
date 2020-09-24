import { Component, Input, Output, EventEmitter } from '@angular/core';

import { MapLayer, CsMap } from 'ol-cityscope';

import { ConfigurationService } from '../../configuration.service';

@Component({
  selector: 'app-layer-switcher',
  templateUrl: './layer-switcher.component.html',
  styleUrls: ['./layer-switcher.component.css']
})
export class LayerSwitcherComponent {
  @Input() layers: MapLayer[];
  @Input() type: string;
  @Output() selectBezirk = new EventEmitter<string>();

  constructor(public config: ConfigurationService, private csMap: CsMap) { }

  onToggleLayer(layer: MapLayer) {
    switch (this.type) {
      case 'radio':
        for (const l of this.layers) {
          l.visible = false;
        }
        layer.visible = true;
        break;
      case 'checkbox':
        layer.visible = !layer.visible;
    }

    this.csMap.syncVisibleLayers();
  }

  auswahlBezirk(value: string) {
    this.selectBezirk.emit(value);
  }
}
