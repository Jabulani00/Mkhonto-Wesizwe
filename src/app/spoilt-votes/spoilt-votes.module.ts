import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpoiltVotesPageRoutingModule } from './spoilt-votes-routing.module';

import { SpoiltVotesPage } from './spoilt-votes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpoiltVotesPageRoutingModule
  ],
  declarations: [SpoiltVotesPage]
})
export class SpoiltVotesPageModule {}
