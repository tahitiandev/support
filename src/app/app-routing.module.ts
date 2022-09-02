import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./app/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'utilisateurs',
    loadChildren: () => import('./app/params/utilisateurs/utilisateurs.module').then( m => m.UtilisateursPageModule)
  },
  {
    path: 'interventions',
    loadChildren: () => import('./app/home/interventions/interventions.module').then( m => m.InterventionsPageModule)
  },
  {
    path: 'connect',
    loadChildren: () => import('./app/connect/connect.module').then( m => m.ConnectPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./app/home/home.module').then( m => m.HomePageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
