import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ElectionResultsPage } from './election-results.page';

const routes: Routes = [
  {
    path: '',
    component: ElectionResultsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ElectionResultsPageRoutingModule {}
