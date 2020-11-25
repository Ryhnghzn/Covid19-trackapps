import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MoreDataPageRoutingModule } from './more-data-routing.module';

import { MoreDataPage } from './more-data.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MoreDataPageRoutingModule
  ],
  declarations: [MoreDataPage]
})
export class MoreDataPageModule {}
