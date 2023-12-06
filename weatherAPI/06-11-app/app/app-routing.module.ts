import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  // new
  // http://localhost:8100/detail/Berlin
  {
    path: 'detail/:id',
    loadChildren: () => import('./pages/detail/detail.module')
    .then( m => m.DetailPageModule)
  },







  
  {
    path: 'detailb',
    loadChildren: () => import('./pagesb/detailb/detailb.module').then( m => m.DetailbPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
