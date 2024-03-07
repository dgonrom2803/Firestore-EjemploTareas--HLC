import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetallePage } from './detalle.page';

const routes: Routes = [
  {
    path: '',
    component: DetallePage
  },
  {
    path: 'informacion',
    redirectTo: '/informacion'
  },
  {
    path: 'mapa',
    redirectTo: '/mapa'
  },
  {
    path: 'home',
    redirectTo: '/home'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetallePageRoutingModule {}
