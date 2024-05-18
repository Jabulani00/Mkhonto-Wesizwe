import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VdPage } from './vd.page';

const routes: Routes = [
  {
    path: '',
    component: VdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VdPageRoutingModule {}
