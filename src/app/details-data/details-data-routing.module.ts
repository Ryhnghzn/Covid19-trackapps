import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsDataPage } from './details-data.page';

const routes: Routes = [
  {
    path: '',
    component: DetailsDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsDataPageRoutingModule {}
