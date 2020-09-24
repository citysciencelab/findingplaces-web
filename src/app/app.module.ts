import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule} from '@angular/common/http';

import { TuioClient } from 'tuio-client';
import { CsMap } from 'ol-cityscope';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfigurationService } from './configuration.service';
import { LocalStorageService } from './communication/local-storage.service';
import { WebsocketService } from './communication/websocket.service';
import { NodeAPIService } from './communication/node-api.service';
import { MapComponent } from './map/map.component';
import { StartComponent } from './start/start.component';
import { ControlComponent } from './control/control.component';
import { LayerSwitcherComponent } from './control/layer-switcher/layer-switcher.component';
import { MatrixAdjustComponent } from './control/matrix-adjust/matrix-adjust.component';
import { ProjectorComponent } from './projector/projector.component';
import { ScreenComponent } from './screen/screen.component';
import { HamburgMonitorComponent } from './screen/hamburg-monitor/hamburg-monitor.component';
import { BezirkMonitorComponent } from './screen/bezirk-monitor/bezirk-monitor.component';
import { FlurstueckMonitorComponent } from './screen/flurstueck-monitor/flurstueck-monitor.component';
import { RefugeeGraphicDirective } from './refugee-graphic/refugee-graphic.directive';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    StartComponent,
    ControlComponent,
    ProjectorComponent,
    ScreenComponent,
    LayerSwitcherComponent,
    MatrixAdjustComponent,
    FlurstueckMonitorComponent,
    BezirkMonitorComponent,
    HamburgMonitorComponent,
    RefugeeGraphicDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: TuioClient,
      useFactory: () => new TuioClient({ enableCursorEvent: false })
    },
    {
      provide: CsMap,
      useFactory: (config: ConfigurationService) => new CsMap(config),
      deps: [ConfigurationService]
    },
    ConfigurationService,
    LocalStorageService,
    WebsocketService,
    NodeAPIService,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
