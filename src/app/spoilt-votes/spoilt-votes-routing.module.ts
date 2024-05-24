import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpoiltVotesPage } from './spoilt-votes.page';

const routes: Routes = [
  {
    path: '',
    component: SpoiltVotesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpoiltVotesPageRoutingModule {}
