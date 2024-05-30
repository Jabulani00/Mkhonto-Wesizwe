import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GetDocPage } from './get-doc.page';

const routes: Routes = [
  {
    path: '',
    component: GetDocPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GetDocPageRoutingModule {}
