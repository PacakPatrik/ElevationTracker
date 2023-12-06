import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailbPage } from './detailb.page';

const routes: Routes = [
  {
    path: '',
    component: DetailbPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailbPageRoutingModule {}
