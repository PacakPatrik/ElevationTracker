import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatsTabPage } from './StatsTab.page';

const routes: Routes = [
  {
    path: '',
    component: StatsTabPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab2PageRoutingModule {}
