import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'HomeTab',
        loadChildren: () => import('../Pages/HomeTab/HomeTab.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'StatsTab',
        loadChildren: () => import('../Pages/StatsTab/StatsTab.module').then(m => m.Tab2PageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/HomeTab',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/HomeTab',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
