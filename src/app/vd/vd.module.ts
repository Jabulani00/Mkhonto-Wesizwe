import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VdPageRoutingModule } from './vd-routing.module';

import { VdPage } from './vd.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VdPageRoutingModule
  ],
  declarations: [VdPage]
})
export class VdPageModule {}
