import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ValidationPage } from './validation.page';

const routes: Routes = [
  {
    path: '',
    component: ValidationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValidationPageRoutingModule {}
