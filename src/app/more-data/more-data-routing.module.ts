import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MoreDataPage } from './more-data.page';

const routes: Routes = [
  {
    path: '',
    component: MoreDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoreDataPageRoutingModule {}
