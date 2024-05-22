import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SlipTakePageRoutingModule } from './slip-take-routing.module';

import { SlipTakePage } from './slip-take.page';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    SlipTakePageRoutingModule
  ],
  declarations: [SlipTakePage]
})
export class SlipTakePageModule {}
