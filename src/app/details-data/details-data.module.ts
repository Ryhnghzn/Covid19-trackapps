import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsDataPageRoutingModule } from './details-data-routing.module';

import { DetailsDataPage } from './details-data.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailsDataPageRoutingModule
  ],
  declarations: [DetailsDataPage]
})
export class DetailsDataPageModule {}
