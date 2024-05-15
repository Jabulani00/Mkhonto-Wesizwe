import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MunicipalityPageRoutingModule } from './municipality-routing.module';

import { MunicipalityPage } from './municipality.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MunicipalityPageRoutingModule
  ],
  declarations: [MunicipalityPage]
})
export class MunicipalityPageModule {}
