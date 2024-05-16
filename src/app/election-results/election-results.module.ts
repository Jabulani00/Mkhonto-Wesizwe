import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ElectionResultsPageRoutingModule } from './election-results-routing.module';

import { ElectionResultsPage } from './election-results.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ElectionResultsPageRoutingModule,ReactiveFormsModule
  ],
  declarations: [ElectionResultsPage]
})
export class ElectionResultsPageModule {}
