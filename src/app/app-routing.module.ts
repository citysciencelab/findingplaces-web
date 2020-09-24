import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StartComponent } from './start/start.component';
import { ControlComponent } from './control/control.component';
import { ProjectorComponent } from './projector/projector.component';
import { ScreenComponent } from './screen/screen.component';

const routes: Routes = [
  { path: '', component: StartComponent },
  { path: 'control', component: ControlComponent},
  { path: 'projector', component: ProjectorComponent},
  { path: 'screen', component: ScreenComponent}
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ]
})
export class AppRoutingModule {}
