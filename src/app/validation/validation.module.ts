import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ValidationPageRoutingModule } from './validation-routing.module';

import { ValidationPage } from './validation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ValidationPageRoutingModule
  ],
  declarations: [ValidationPage]
})
export class ValidationPageModule {}
