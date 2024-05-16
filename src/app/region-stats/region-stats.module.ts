import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegionStatsPageRoutingModule } from './region-stats-routing.module';

import { RegionStatsPage } from './region-stats.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegionStatsPageRoutingModule
  ],
  declarations: [RegionStatsPage]
})
export class RegionStatsPageModule {}
