import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GetDocPageRoutingModule } from './get-doc-routing.module';

import { GetDocPage } from './get-doc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GetDocPageRoutingModule
  ],
  declarations: [GetDocPage]
})
export class GetDocPageModule {}
