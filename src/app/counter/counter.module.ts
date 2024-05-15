import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CounterPageRoutingModule } from './counter-routing.module';

import { CounterPage } from './counter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CounterPageRoutingModule,ReactiveFormsModule, // Add ReactiveFormsModule here
  ],
  declarations: [CounterPage]
})
export class CounterPageModule {}
