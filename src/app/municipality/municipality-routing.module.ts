import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MunicipalityPage } from './municipality.page';

const routes: Routes = [
  {
    path: '',
    component: MunicipalityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MunicipalityPageRoutingModule {}
